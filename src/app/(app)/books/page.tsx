"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  getRepository,
  type MockAppState,
  type ReadingFormat,
  type ReadingGoalType
} from "@/lib/persistence/repository";

const formats: ReadingFormat[] = ["print", "ebook", "audiobook", "mixed"];
const goalTypes: ReadingGoalType[] = ["pages", "chapters", "minutes", "sessions"];
const searchModes = [
  { value: "all", label: "All fields" },
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "isbn", label: "ISBN" },
  { value: "subject", label: "Subject" },
  { value: "publisher", label: "Publisher" },
  { value: "lccn", label: "LCCN" },
  { value: "oclc", label: "OCLC" }
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" }
];

const filterOptions = [
  { value: "all", label: "Any edition" },
  { value: "partial", label: "Preview available" },
  { value: "full", label: "Full view" },
  { value: "ebooks", label: "Ebook" },
  { value: "free-ebooks", label: "Free ebook" }
];

const languageOptions = [
  { value: "", label: "Any language" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" }
];

type BookSearchResult = {
  id: string;
  title: string;
  author: string;
  publisher: string | null;
  publishedDate: string | null;
  description: string;
  pageCount: number | null;
  categories: string[];
  averageRating: number | null;
  ratingsCount: number | null;
  thumbnail: string | null;
  isbn10: string | null;
  isbn13: string | null;
  previewLink: string | null;
  infoLink: string | null;
};

type BookSearchPayload = {
  totalItems?: number;
  startIndex?: number;
  maxResults?: number;
  nextStartIndex?: number | null;
  hasMore?: boolean;
  items?: BookSearchResult[];
  error?: string;
};

export default function BooksPage() {
  const [state, setState] = useState<MockAppState | null>(null);
  const [searchQuery, setSearchQuery] = useState("Tomorrow, and Tomorrow, and Tomorrow");
  const [searchMode, setSearchMode] = useState("all");
  const [searchOrderBy, setSearchOrderBy] = useState("relevance");
  const [searchFilter, setSearchFilter] = useState("all");
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchTotalItems, setSearchTotalItems] = useState(0);
  const [nextSearchStartIndex, setNextSearchStartIndex] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [format, setFormat] = useState<ReadingFormat>("print");
  const [goalType, setGoalType] = useState<ReadingGoalType>("pages");
  const [totalPages, setTotalPages] = useState("");
  const [totalChapters, setTotalChapters] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [currentChapter, setCurrentChapter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getRepository().getState().then(setState);
  }, []);

  function numericValue(value: string) {
    return value.trim() ? Number(value) : null;
  }

  function isBookSaved(book: BookSearchResult) {
    return Boolean(
      state?.books.some(
        (item) =>
          (book.id && item.externalSource === "google_books" && item.externalId === book.id) ||
          (book.isbn13 && item.isbn13 === book.isbn13) ||
          (book.isbn10 && item.isbn10 === book.isbn10)
      )
    );
  }

  function mergeSearchResults(current: BookSearchResult[], next: BookSearchResult[]) {
    const seen = new Set(current.map((book) => book.id));
    return [...current, ...next.filter((book) => !seen.has(book.id))];
  }

  async function runSearch(startIndex = 0) {
    const isLoadingMore = startIndex > 0;

    if (searchQuery.trim().length < 2) {
      setSearchMessage("Search needs at least two characters.");
      return;
    }

    setIsSearching(true);
    setSearchMessage(isLoadingMore ? "Looking for more catalog results." : "Searching the book catalog.");

    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        mode: searchMode,
        orderBy: searchOrderBy,
        filter: searchFilter,
        maxResults: "12",
        startIndex: String(startIndex)
      });
      if (searchLanguage) params.set("langRestrict", searchLanguage);
      const response = await fetch(`/api/books/search?${params.toString()}`);
      const payload = (await response.json()) as BookSearchPayload;

      if (!response.ok) {
        if (!isLoadingMore) setSearchResults([]);
        setSearchMessage(payload.error ?? "Book search is temporarily unavailable.");
        return;
      }

      const items = payload.items ?? [];
      const nextResults = isLoadingMore ? mergeSearchResults(searchResults, items) : items;
      setSearchResults(nextResults);
      setSearchTotalItems(payload.totalItems ?? 0);
      setNextSearchStartIndex(payload.nextStartIndex ?? null);
      setSearchMessage(
        nextResults.length
          ? "Choose a result to add it to your current reading list."
          : isLoadingMore
            ? "No more results for this search."
            : "No match yet. Try author, title, ISBN, or a broader search."
      );
    } catch {
      if (!isLoadingMore) setSearchResults([]);
      setSearchMessage("Book search is temporarily unavailable.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runSearch(0);
  }

  async function addCatalogBook(book: BookSearchResult) {
    const wasAlreadySaved = isBookSaved(book);
    const nextState = await getRepository().addBook({
      title: book.title,
      author: book.author,
      externalSource: "google_books",
      externalId: book.id,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      description: book.description,
      categories: book.categories,
      coverImageUrl: book.thumbnail,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
      format,
      goalType: book.pageCount ? "pages" : goalType,
      totalPages: book.pageCount,
      totalChapters: null,
      currentPage: 0,
      currentChapter: null
    });

    setState(nextState);
    setMessage(
      wasAlreadySaved
        ? `${book.title} is already in your local books. I moved it to the top.`
        : `${book.title} added from the book catalog.`
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Book title is required.");
      return;
    }

    const nextTotalPages = numericValue(totalPages);
    const nextTotalChapters = numericValue(totalChapters);
    const nextCurrentPage = numericValue(currentPage);
    const nextCurrentChapter = numericValue(currentChapter);

    if (
      [nextTotalPages, nextTotalChapters, nextCurrentPage, nextCurrentChapter].some(
        (value) => value !== null && (!Number.isFinite(value) || value < 0)
      )
    ) {
      setMessage("Progress values must be zero or greater.");
      return;
    }

    if (nextTotalPages !== null && nextCurrentPage !== null && nextCurrentPage > nextTotalPages) {
      setMessage("Current page cannot be beyond the total pages.");
      return;
    }

    if (
      nextTotalChapters !== null &&
      nextCurrentChapter !== null &&
      nextCurrentChapter > nextTotalChapters
    ) {
      setMessage("Current chapter cannot be beyond the total chapters.");
      return;
    }

    setState(
      await getRepository().addBook({
        title: title.trim(),
        author: author.trim(),
        externalSource: "manual",
        format,
        goalType,
        totalPages: nextTotalPages,
        totalChapters: nextTotalChapters,
        currentPage: nextCurrentPage,
        currentChapter: nextCurrentChapter
      })
    );
    setTitle("");
    setAuthor("");
    setTotalPages("");
    setTotalChapters("");
    setCurrentPage("");
    setCurrentChapter("");
    setMessage("Book added to your current reading list.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Books"
        title="Find and track the book you are already reading."
        description="Search the public book catalog, save the right edition, then keep local reading progress simple."
      />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="soft-card overflow-hidden">
          <div className="border-b border-[#ded5c6] bg-[#f2e7d8]/60 px-5 py-4">
            <p className="eyebrow">Book catalog</p>
            <h2 className="mt-2 text-xl font-black text-ink">Search Google Books</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Find the right edition, then save it locally to Reading Momentum.
            </p>
          </div>
          <div className="p-5">
            <form className="grid gap-4" onSubmit={handleSearch}>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Search
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Title, author, subject, or ISBN"
                  value={searchQuery}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-[0.7fr_0.3fr]">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Search by
                  <select
                    className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                    onChange={(event) => setSearchMode(event.target.value)}
                    value={searchMode}
                  >
                    {searchModes.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="primary-button self-end" disabled={isSearching} type="submit">
                  {isSearching ? "Searching" : "Search"}
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Sort
                  <select
                    className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                    onChange={(event) => setSearchOrderBy(event.target.value)}
                    value={searchOrderBy}
                  >
                    {sortOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Edition
                  <select
                    className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                    onChange={(event) => setSearchFilter(event.target.value)}
                    value={searchFilter}
                  >
                    {filterOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Language
                  <select
                    className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                    onChange={(event) => setSearchLanguage(event.target.value)}
                    value={searchLanguage}
                  >
                    {languageOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </form>

            {searchMessage ? (
              <p className="note-card mt-4 p-3 text-sm text-slate-700">{searchMessage}</p>
            ) : null}
            {searchResults.length ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-slate-600">
                  {searchResults.length} shown
                  {searchTotalItems ? ` from ${searchTotalItems.toLocaleString()} catalog matches` : ""}
                </p>
                {nextSearchStartIndex !== null ? (
                  <button
                    className="secondary-button"
                    disabled={isSearching}
                    onClick={() => runSearch(nextSearchStartIndex)}
                    type="button"
                  >
                    {isSearching ? "Loading" : "Load more"}
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {searchResults.map((book) => (
                <article className="note-card grid gap-4 p-4 sm:grid-cols-[5rem_1fr]" key={book.id}>
                  <div
                    aria-label={book.title}
                    className="min-h-28 rounded-app border border-[#ded5c6] bg-[#f2e7d8] bg-cover bg-center shadow-sm"
                    role="img"
                    style={book.thumbnail ? { backgroundImage: `url(${book.thumbnail})` } : undefined}
                  />
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-ink">{book.title}</h3>
                        <p className="mt-1 text-sm text-slate-700">
                          {book.author || "Unknown author"}
                          {book.publishedDate ? ` - ${book.publishedDate}` : ""}
                        </p>
                      </div>
                      {book.pageCount ? (
                        <span className="status-pill">{book.pageCount} pages</span>
                      ) : null}
                    </div>
                    {book.description ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">
                        {book.description}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {book.categories.slice(0, 2).map((category) => (
                        <span className="warm-pill" key={category}>
                          {category}
                        </span>
                      ))}
                      {book.isbn13 ? <span className="status-pill">ISBN {book.isbn13}</span> : null}
                    </div>
                    <button
                      className="secondary-button mt-4"
                      onClick={() => addCatalogBook(book)}
                      type="button"
                    >
                      {isBookSaved(book) ? "Already in my books" : "Add to my books"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <form className="soft-card grid gap-4 p-5" onSubmit={handleSubmit}>
          <h2 className="text-xl font-black text-ink">Manual book entry</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Title
            <input
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Book title"
              value={title}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Author
            <input
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="Author"
              value={author}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Format
              <select
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setFormat(event.target.value as ReadingFormat)}
                value={format}
              >
                {formats.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Goal type
              <select
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setGoalType(event.target.value as ReadingGoalType)}
                value={goalType}
              >
                {goalTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Total pages
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                min="0"
                onChange={(event) => setTotalPages(event.target.value)}
                type="number"
                value={totalPages}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Current page
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                min="0"
                onChange={(event) => setCurrentPage(event.target.value)}
                type="number"
                value={currentPage}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Total chapters
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                min="0"
                onChange={(event) => setTotalChapters(event.target.value)}
                type="number"
                value={totalChapters}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Current chapter
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                min="0"
                onChange={(event) => setCurrentChapter(event.target.value)}
                type="number"
                value={currentChapter}
              />
            </label>
          </div>
          {message ? (
            <p className="rounded-app border border-[#dedbd2] bg-white p-3 text-sm text-slate-700">
              {message}
            </p>
          ) : null}
          <button className="primary-button" type="submit">
            Add book
          </button>
        </form>
        <section className="soft-card p-5 xl:col-span-2">
          <h2 className="text-xl font-black text-ink">Your current books</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {state?.books.length ? (
              state.books.map((book) => (
                <article className="note-card grid gap-4 p-4 sm:grid-cols-[4.5rem_1fr]" key={book.id}>
                  <div
                    aria-label={book.title}
                    className="min-h-24 rounded-app border border-[#ded5c6] bg-[#f2e7d8] bg-cover bg-center shadow-sm"
                    role="img"
                    style={book.coverImageUrl ? { backgroundImage: `url(${book.coverImageUrl})` } : undefined}
                  />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-ink">{book.title}</h3>
                      <p className="mt-1 text-sm text-slate-700">
                        {book.author || "Unknown author"} - {book.format} - {book.goalType}
                      </p>
                      {book.description ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                          {book.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="status-pill">
                      {book.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 sm:col-start-2">
                    Page {book.currentPage ?? "?"}
                    {book.totalPages ? ` of ${book.totalPages}` : ""} - Chapter{" "}
                    {book.currentChapter ?? "?"}
                    {book.totalChapters ? ` of ${book.totalChapters}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:col-start-2">
                    {book.externalSource === "google_books" ? (
                      <span className="warm-pill">Google Books</span>
                    ) : (
                      <span className="warm-pill">Manual</span>
                    )}
                    {book.categories.slice(0, 2).map((category) => (
                      <span className="status-pill" key={category}>
                        {category}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <p className="note-card p-4 text-slate-700">
                No current books yet. Add one to unlock the check-in flow on Today.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
