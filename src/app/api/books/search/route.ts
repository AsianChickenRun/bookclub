import { NextResponse } from "next/server";

type GoogleVolume = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type?: string;
      identifier?: string;
    }>;
    previewLink?: string;
    infoLink?: string;
  };
};

type GoogleBooksResponse = {
  totalItems?: number;
  items?: GoogleVolume[];
};

const searchModes = new Set(["all", "title", "author", "isbn", "subject"]);

function buildQuery(query: string, mode: string) {
  const normalized = query.trim();

  if (mode === "title") return `intitle:${normalized}`;
  if (mode === "author") return `inauthor:${normalized}`;
  if (mode === "isbn") return `isbn:${normalized.replaceAll("-", "").replaceAll(" ", "")}`;
  if (mode === "subject") return `subject:${normalized}`;

  return normalized;
}

function normalizeVolume(volume: GoogleVolume) {
  const info = volume.volumeInfo ?? {};
  const identifiers = info.industryIdentifiers ?? [];
  const isbn13 = identifiers.find((item) => item.type === "ISBN_13")?.identifier ?? null;
  const isbn10 = identifiers.find((item) => item.type === "ISBN_10")?.identifier ?? null;
  const thumbnail = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null;

  return {
    id: volume.id,
    title: info.title ?? "Untitled book",
    authors: info.authors ?? [],
    author: info.authors?.join(", ") ?? "",
    publisher: info.publisher ?? null,
    publishedDate: info.publishedDate ?? null,
    description: info.description ?? "",
    pageCount: info.pageCount ?? null,
    categories: info.categories ?? [],
    averageRating: info.averageRating ?? null,
    ratingsCount: info.ratingsCount ?? null,
    thumbnail: thumbnail?.replace("http://", "https://") ?? null,
    isbn13,
    isbn10,
    previewLink: info.previewLink ?? null,
    infoLink: info.infoLink ?? null
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const requestedMode = searchParams.get("mode") ?? "all";
  const mode = searchModes.has(requestedMode) ? requestedMode : "all";
  const maxResults = Math.min(Math.max(Number(searchParams.get("maxResults")) || 12, 1), 40);
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Books API key is not configured." },
      { status: 503 }
    );
  }

  if (query.length < 2) {
    return NextResponse.json(
      { error: "Search needs at least two characters." },
      { status: 400 }
    );
  }

  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", buildQuery(query, mode));
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("printType", "books");
  url.searchParams.set("projection", "lite");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: 60 * 60
    }
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Book search is temporarily unavailable." },
      { status: response.status }
    );
  }

  const payload = (await response.json()) as GoogleBooksResponse;

  return NextResponse.json({
    totalItems: payload.totalItems ?? 0,
    items: (payload.items ?? []).map(normalizeVolume)
  });
}
