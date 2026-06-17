"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  getRepository,
  type CheckInUnit,
  type MockAppState,
  type MockGroupMember,
  type MockGroupRitual,
  type SpoilerLevel
} from "@/lib/persistence/repository";

const spoilerLevels: { value: SpoilerLevel; label: string }[] = [
  { value: "none", label: "No spoilers" },
  { value: "progress_locked", label: "Progress locked" },
  { value: "explicit", label: "Explicit spoiler" }
];

const checkInUnits: CheckInUnit[] = ["pages", "chapters", "minutes", "audiobook_minutes", "sessions"];

const bookSearchModes = [
  { value: "all", label: "All fields" },
  { value: "title", label: "Title" },
  { value: "author", label: "Author" },
  { value: "isbn", label: "ISBN" },
  { value: "subject", label: "Subject" },
  { value: "publisher", label: "Publisher" }
];

const bookSearchSortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" }
];

const memberStatuses: { value: MockGroupMember["readingStatus"]; label: string }[] = [
  { value: "reading", label: "Reading" },
  { value: "checked_in", label: "Checked in" },
  { value: "quiet", label: "Quiet" }
];

const ritualCadences: { value: MockGroupRitual["cadence"]; label: string }[] = [
  { value: "monday", label: "Monday check-in" },
  { value: "thursday", label: "Thursday discussion" },
  { value: "weekend", label: "Weekend reflection" },
  { value: "custom", label: "Custom rhythm" }
];

const defaultDiscussionPrompt =
  "What moment from your current reading would be good to talk through together?";

type BookSearchResult = {
  id: string;
  title: string;
  author: string;
  publisher: string | null;
  publishedDate: string | null;
  description: string;
  pageCount: number | null;
  categories: string[];
  thumbnail: string | null;
  isbn10: string | null;
  isbn13: string | null;
};

type BookSearchPayload = {
  totalItems?: number;
  nextStartIndex?: number | null;
  items?: BookSearchResult[];
  error?: string;
};

function formatSpoilerLabel(level: SpoilerLevel) {
  if (level === "progress_locked") return "Progress locked";
  if (level === "explicit") return "Explicit spoiler";
  return "No spoilers";
}

function dateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function recentDateKeys(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return dateKey(date);
  });
}

type RoomBook = MockAppState["books"][number];

function shortPublishedDate(book: RoomBook) {
  return book.publishedDate?.slice(0, 4) ?? "";
}

function bookMetadataPills(book: RoomBook) {
  return [
    book.totalPages ? `${book.totalPages} pages` : "",
    book.categories[0] ?? "",
    book.externalSource === "google_books" ? "Saved from Google Books" : "",
    book.isbn13 ? `ISBN ${book.isbn13}` : book.isbn10 ? `ISBN ${book.isbn10}` : ""
  ].filter(Boolean);
}

function bookEditionLine(book: RoomBook) {
  return [
    shortPublishedDate(book) ? `Published ${shortPublishedDate(book)}` : "",
    book.publisher ? `by ${book.publisher}` : "",
    book.totalPages ? `${book.totalPages} pages` : "",
    book.externalSource === "google_books" ? "Saved from Google Books" : ""
  ].filter(Boolean).join(" · ");
}

function bookDescriptionExcerpt(book: RoomBook, maxLength = 138) {
  const description = book.description.trim();
  if (!description) return "";
  return description.length > maxLength ? `${description.slice(0, maxLength).trim()}...` : description;
}

function BookCover({ book, size = "large" }: { book: RoomBook; size?: "large" | "small" }) {
  return (
    <div
      aria-label={book.title}
      className={`rounded-app border border-[#ded5c6] bg-[#f2e7d8] bg-cover bg-center shadow-sm ${
        size === "large" ? "min-h-36" : "min-h-20"
      }`}
      role="img"
      style={book.coverImageUrl ? { backgroundImage: `url(${book.coverImageUrl})` } : undefined}
    />
  );
}

export default function GroupRoomPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const [state, setState] = useState<MockAppState | null>(null);
  const [message, setMessage] = useState("");
  const [revealedPostIds, setRevealedPostIds] = useState<Set<string>>(new Set());
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [discussionBody, setDiscussionBody] = useState(defaultDiscussionPrompt);
  const [shouldReplaceDiscussionDraft, setShouldReplaceDiscussionDraft] = useState(false);
  const [relatedBookId, setRelatedBookId] = useState("");
  const [spoilerLevel, setSpoilerLevel] = useState<SpoilerLevel>("none");
  const [spoilerPage, setSpoilerPage] = useState("");
  const [spoilerChapter, setSpoilerChapter] = useState("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [bookSearchMode, setBookSearchMode] = useState("all");
  const [bookSearchOrderBy, setBookSearchOrderBy] = useState("relevance");
  const [bookSearchResults, setBookSearchResults] = useState<BookSearchResult[]>([]);
  const [bookSearchMessage, setBookSearchMessage] = useState("");
  const [bookSearchTotalItems, setBookSearchTotalItems] = useState(0);
  const [nextBookSearchStartIndex, setNextBookSearchStartIndex] = useState<number | null>(null);
  const [isBookSearching, setIsBookSearching] = useState(false);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberStatus, setMemberStatus] = useState<MockGroupMember["readingStatus"]>("reading");
  const [memberBookTitle, setMemberBookTitle] = useState("");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [ritualCadence, setRitualCadence] = useState<MockGroupRitual["cadence"]>("thursday");
  const [ritualPrompt, setRitualPrompt] = useState("");
  const [ritualFocusNote, setRitualFocusNote] = useState("");
  const [showRitualForm, setShowRitualForm] = useState(false);
  const [checkInBookId, setCheckInBookId] = useState("");
  const [checkInUnit, setCheckInUnit] = useState<CheckInUnit>("pages");
  const [checkInAmount, setCheckInAmount] = useState("");
  const [checkInSkipped, setCheckInSkipped] = useState(false);
  const [checkInNote, setCheckInNote] = useState("");
  const discussionSectionRef = useRef<HTMLElement | null>(null);
  const discussionTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    getRepository().getState().then((nextState) => {
      setState(nextState);
      const existingRitual = nextState.groupRituals.find((ritual) => ritual.groupId === groupId);
      if (existingRitual) {
        setRitualCadence(existingRitual.cadence);
        setRitualPrompt(existingRitual.prompt);
        setRitualFocusNote(existingRitual.focusNote);
      }
      setCheckInBookId(getRepository().getMostRecentBook(nextState)?.id ?? "");
    });
  }, [groupId]);

  const group = state?.groups.find((item) => item.id === groupId);
  const posts = useMemo(
    () => state?.discussionPosts.filter((post) => post.groupId === groupId).slice(0, 8) ?? [],
    [groupId, state]
  );
  const activities = useMemo(
    () => state?.activities.filter((activity) => activity.groupId === groupId).slice(0, 8) ?? [],
    [groupId, state]
  );
  const currentBook = state ? getRepository().getMostRecentBook(state) : undefined;
  const roomMembers = useMemo(() => {
    if (!state) return [];

    const storedMembers = state.groupMembers.filter((member) => member.groupId === groupId);
    if (storedMembers.length) return storedMembers;

    return [
      {
        id: "local-reader",
        groupId,
        displayName: state.profile?.displayName ?? "You",
        role: group?.role ?? "owner",
        readingStatus: "reading",
        currentBookTitle: currentBook?.title ?? null,
        joinedAt: new Date().toISOString()
      }
    ] satisfies MockGroupMember[];
  }, [currentBook?.title, group?.role, groupId, state]);
  const roomRitual =
    state?.groupRituals.find((ritual) => ritual.groupId === groupId) ?? {
      id: "default-ritual",
      groupId,
      cadence: "thursday",
      prompt: "Share one line, question, or moment worth returning to.",
      focusNote: "A small rhythm for reading together. Join anywhere; quiet weeks still count.",
      updatedAt: new Date().toISOString()
    };
  const lastSeven = recentDateKeys(7);
  const groupCheckIns = activities.filter(
    (activity) => activity.type === "check_in" && lastSeven.includes(activity.createdAt.slice(0, 10))
  );
  const totalReplies =
    state?.discussionComments.filter((comment) =>
      posts.some((post) => post.id === comment.postId)
    ).length ?? 0;
  const selectedDiscussionBook =
    state?.books.find((book) => book.id === relatedBookId) ?? currentBook;

  function focusDiscussionComposer() {
    discussionSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => discussionTextareaRef.current?.focus(), 120);
  }

  function handleUseRitualPrompt() {
    const prompt = roomRitual.prompt.trim();
    const hasCustomDraft =
      Boolean(discussionBody.trim()) &&
      discussionBody !== defaultDiscussionPrompt &&
      discussionBody.trim() !== prompt;

    if (hasCustomDraft && !shouldReplaceDiscussionDraft) {
      setShouldReplaceDiscussionDraft(true);
      setMessage("You already have a draft. Choose replace draft to use the table prompt.");
      focusDiscussionComposer();
      return;
    }

    setDiscussionBody(prompt);
    setRelatedBookId("");
    setSpoilerLevel("none");
    setSpoilerPage("");
    setSpoilerChapter("");
    setShouldReplaceDiscussionDraft(false);
    setMessage("Table prompt added. Add your note when you are ready.");
    focusDiscussionComposer();
  }

  function mergeBookSearchResults(current: BookSearchResult[], next: BookSearchResult[]) {
    const seen = new Set(current.map((book) => book.id));
    return [...current, ...next.filter((book) => !seen.has(book.id))];
  }

  async function handleBookSearch(startIndex = 0) {
    const isLoadingMore = startIndex > 0;

    if (bookSearchQuery.trim().length < 2) {
      setBookSearchMessage("Search needs at least two characters.");
      return;
    }

    setIsBookSearching(true);
    setBookSearchMessage(isLoadingMore ? "Looking for more room book results." : "Searching the book catalog.");

    try {
      const params = new URLSearchParams({
        q: bookSearchQuery.trim(),
        mode: bookSearchMode,
        orderBy: bookSearchOrderBy,
        maxResults: "6",
        startIndex: String(startIndex)
      });
      const response = await fetch(`/api/books/search?${params.toString()}`);
      const payload = (await response.json()) as BookSearchPayload;

      if (!response.ok) {
        if (!isLoadingMore) setBookSearchResults([]);
        setBookSearchMessage(payload.error ?? "Book search is temporarily unavailable.");
        return;
      }

      const items = payload.items ?? [];
      const nextResults = isLoadingMore
        ? mergeBookSearchResults(bookSearchResults, items)
        : items;
      setBookSearchResults(nextResults);
      setBookSearchTotalItems(payload.totalItems ?? 0);
      setNextBookSearchStartIndex(payload.nextStartIndex ?? null);
      setBookSearchMessage(
        nextResults.length
          ? "Attach a result to this room discussion."
          : isLoadingMore
            ? "No more room book results."
            : "No match yet. Try title, author, ISBN, or a broader search."
      );
    } catch {
      if (!isLoadingMore) setBookSearchResults([]);
      setBookSearchMessage("Book search is temporarily unavailable.");
    } finally {
      setIsBookSearching(false);
    }
  }

  async function handleAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!memberName.trim()) {
      setMessage("Add a member name before saving.");
      return;
    }

    const nextState = await getRepository().addGroupMember({
      groupId,
      displayName: memberName.trim(),
      readingStatus: memberStatus,
      currentBookTitle: memberBookTitle.trim() || null
    });

    setState(nextState);
    setMemberName("");
    setMemberBookTitle("");
    setMemberStatus("reading");
    setMessage("Local member added to this room.");
  }

  async function handleRitualSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ritualPrompt.trim()) {
      setMessage("Add a ritual prompt before saving.");
      return;
    }

    const nextState = await getRepository().saveGroupRitual({
      groupId,
      cadence: ritualCadence,
      prompt: ritualPrompt.trim(),
      focusNote:
        ritualFocusNote.trim() ||
        "A small rhythm for reading together. Join anywhere; quiet weeks still count."
    });

    setState(nextState);
    setShowRitualForm(false);
    setMessage("Room ritual saved.");
  }

  async function handleRoomCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const book = state?.books.find((item) => item.id === checkInBookId) ?? currentBook;

    if (!book) {
      setMessage("Add a current book before leaving a quiet check-in.");
      return;
    }

    const numericAmount = checkInAmount.trim() ? Number(checkInAmount) : 0;

    if (!checkInSkipped && (!Number.isFinite(numericAmount) || numericAmount <= 0)) {
      setMessage("Enter a reading amount, or mark this as a quiet reading week.");
      return;
    }

    if (numericAmount < 0) {
      setMessage("Progress values must be zero or greater.");
      return;
    }

    const nextState = await getRepository().addReadingLog({
      userBookId: book.id,
      groupId,
      unit: checkInUnit,
      amount: checkInSkipped ? 0 : numericAmount,
      skipped: checkInSkipped,
      visibility: "groups",
      note: checkInNote.trim()
    });

    setState(nextState);
    setCheckInBookId(book.id);
    setCheckInAmount("");
    setCheckInSkipped(false);
    setCheckInNote("");
    setMessage(checkInSkipped ? "Quiet reading week saved for this room." : "Your note is on the table.");
  }

  async function attachCatalogBook(book: BookSearchResult) {
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
      format: "print",
      goalType: book.pageCount ? "pages" : "sessions",
      totalPages: book.pageCount,
      totalChapters: null,
      currentPage: 0,
      currentChapter: null
    });
    const addedBook =
      nextState.books.find((item) => item.externalSource === "google_books" && item.externalId === book.id) ??
      nextState.books.find((item) => Boolean(book.isbn13) && item.isbn13 === book.isbn13) ??
      nextState.books.find((item) => Boolean(book.isbn10) && item.isbn10 === book.isbn10) ??
      nextState.books[0];

    setState(nextState);
    setRelatedBookId(addedBook.id);
    setBookSearchResults([]);
    setBookSearchMessage(`${book.title} is attached to this discussion.`);
  }

  async function handleDiscussion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!discussionBody.trim()) {
      setMessage("Add a discussion prompt before posting.");
      return;
    }

    const nextState = await getRepository().addDiscussionPost({
      groupId,
      body: discussionBody.trim(),
      relatedBookId: relatedBookId || currentBook?.id || null,
      spoilerLevel,
      spoilerPage: spoilerPage.trim() ? Number(spoilerPage) : null,
      spoilerChapter: spoilerChapter.trim() ? Number(spoilerChapter) : null
    });

    setState(nextState);
    setDiscussionBody("");
    setShouldReplaceDiscussionDraft(false);
    setRelatedBookId("");
    setSpoilerLevel("none");
    setSpoilerPage("");
    setSpoilerChapter("");
    setMessage("Discussion started in this room.");
  }

  async function handleReply(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    const body = replyDrafts[postId]?.trim();

    if (!body) {
      setMessage("Write a reply before posting.");
      return;
    }

    const nextState = await getRepository().addDiscussionComment({ postId, body });
    setState(nextState);
    setReplyDrafts((current) => ({ ...current, [postId]: "" }));
    setMessage("Reply added to the group room.");
  }

  function toggleReveal(postId: string) {
    setRevealedPostIds((current) => {
      const next = new Set(current);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  }

  if (!state) {
    return (
      <PageHeader
        eyebrow="Group room"
        title="Loading group room."
        description="Gathering this group&apos;s reading session, activity, and discussions."
      />
    );
  }

  if (!group) {
    return (
      <>
        <PageHeader
          eyebrow="Group room"
          title="Group not found."
          description="This browser does not have that group saved. Create or join a group to open its room."
        />
        <Link className="secondary-button" href="/groups">
          Back to groups
        </Link>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Group room"
        title={group.name}
        description={group.description || "A private reading room for steady progress together."}
      />

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="soft-card overflow-hidden">
          <div className="border-b border-[#ded5c6] bg-[#f2e7d8]/60 px-5 py-4">
            <p className="eyebrow">Reading room</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              A shared table for check-ins, discussion, and gentle accountability.
            </p>
          </div>
          <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1">
              <p className="eyebrow">Session focus</p>
              {currentBook ? (
                <div className="mt-3 grid gap-4 sm:grid-cols-[6.25rem_1fr]">
                  <BookCover book={currentBook} />
                  <div>
                    <h2 className="text-2xl font-black text-ink">{currentBook.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {currentBook.author || "Unknown author"}
                    </p>
                    {bookEditionLine(currentBook) ? (
                      <p className="mt-1 text-sm font-bold text-slate-600">
                        {bookEditionLine(currentBook)}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm font-bold text-slate-600">
                        Edition details not saved yet.
                      </p>
                    )}
                    {bookDescriptionExcerpt(currentBook) ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700">
                        About this edition: {bookDescriptionExcerpt(currentBook)}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {bookMetadataPills(currentBook).slice(0, 3).map((item) => (
                        <span className="status-pill" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      Keep notes and spoilers tied to this edition.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="mt-3 text-2xl font-black text-ink">Choose a current book</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Add a current book so the room can center around real reading progress.
                  </p>
                </>
              )}
            </div>
            <span className="status-pill">
              {group.role}
            </span>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="metric-card p-4">
              <dt className="text-xs font-bold text-slate-500">Reading notes this week</dt>
              <dd className="mt-1 text-2xl font-black text-ink">{groupCheckIns.length}</dd>
            </div>
            <div className="metric-card p-4">
              <dt className="text-xs font-bold text-slate-500">Discussions</dt>
              <dd className="mt-1 text-2xl font-black text-ink">{posts.length}</dd>
            </div>
            <div className="metric-card p-4">
              <dt className="text-xs font-bold text-slate-500">Replies</dt>
              <dd className="mt-1 text-2xl font-black text-ink">{totalReplies}</dd>
            </div>
            <div className="metric-card p-4">
              <dt className="text-xs font-bold text-slate-500">Invite</dt>
              <dd className="mt-1 font-black text-ink">{group.inviteCode}</dd>
            </div>
          </dl>

          <form className="room-card mt-6 grid gap-3 p-4" onSubmit={handleRoomCheckIn}>
            <div>
              <p className="text-sm font-black text-ink">Leave a quiet check-in</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Share a page, a line, or a small reading note. Short is welcome.
              </p>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Book
              <select
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setCheckInBookId(event.target.value)}
                value={checkInBookId}
              >
                <option value="">Use current book</option>
                {state.books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Where are you in the book?
                <select
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  disabled={checkInSkipped}
                  onChange={(event) => setCheckInUnit(event.target.value as CheckInUnit)}
                  value={checkInUnit}
                >
                  {checkInUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Amount
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  disabled={checkInSkipped}
                  min="0"
                  onChange={(event) => setCheckInAmount(event.target.value)}
                  type="number"
                  value={checkInAmount}
                />
              </label>
            </div>
            <label className="flex items-center gap-3 rounded-app border border-[#dedbd2] bg-[#fffdf8] p-3 text-sm font-bold text-slate-700">
              <input
                checked={checkInSkipped}
                onChange={(event) => setCheckInSkipped(event.target.checked)}
                type="checkbox"
              />
              Quiet reading week
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Optional note
              <textarea
                className="min-h-20 rounded-app border border-[#dedbd2] px-3 py-2"
                onChange={(event) => setCheckInNote(event.target.value)}
                placeholder="I read to page 42, and I am still thinking about..."
                value={checkInNote}
              />
            </label>
            <button className="primary-button justify-self-start" type="submit">
              Add check-in
            </button>
          </form>

          <div className="room-card mt-6 p-4">
            <p className="text-sm font-black text-ink">This week at the table</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
              <li>Settle in: what do you want to notice as you read this week?</li>
              <li>Leave a page note: share one line, question, or moment worth returning to.</li>
              <li>Close the week: what stayed with you after reading?</li>
            </ul>
          </div>

          <div className="room-card mt-4 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-ink">Table prompt</p>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {ritualCadences.find((item) => item.value === roomRitual.cadence)?.label}
                </p>
              </div>
              <button
                className="text-sm font-bold text-[#315c48]"
                onClick={() => {
                  setRitualCadence(roomRitual.cadence);
                  setRitualPrompt(roomRitual.prompt);
                  setRitualFocusNote(roomRitual.focusNote);
                  setShowRitualForm((current) => !current);
                }}
                type="button"
              >
                {showRitualForm ? "Close" : "Edit ritual"}
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{roomRitual.prompt}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{roomRitual.focusNote}</p>
            <button
              className="secondary-button mt-4 justify-self-start"
              onClick={handleUseRitualPrompt}
              type="button"
            >
              {shouldReplaceDiscussionDraft ? "Replace draft with prompt" : "Start from this prompt"}
            </button>
          </div>

          {showRitualForm ? (
            <form className="room-card mt-3 grid gap-3 p-4" onSubmit={handleRitualSave}>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Rhythm
                <select
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  onChange={(event) =>
                    setRitualCadence(event.target.value as MockGroupRitual["cadence"])
                  }
                  value={ritualCadence}
                >
                  {ritualCadences.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Prompt
                <textarea
                  className="min-h-20 rounded-app border border-[#dedbd2] px-3 py-2"
                  onChange={(event) => setRitualPrompt(event.target.value)}
                  value={ritualPrompt}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Focus note
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  onChange={(event) => setRitualFocusNote(event.target.value)}
                  value={ritualFocusNote}
                />
              </label>
              <button className="secondary-button justify-self-start" type="submit">
                Save ritual
              </button>
            </form>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-black text-ink">Local room roster</p>
            <div className="mt-3 grid gap-3">
              {roomMembers.map((member) => (
                <div className="note-card p-3" key={member.id}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black text-ink">{member.displayName}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{member.role}</p>
                    </div>
                    <span className="status-pill">
                      {memberStatuses.find((item) => item.value === member.readingStatus)?.label}
                    </span>
                  </div>
                  {member.currentBookTitle ? (
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Reading {member.currentBookTitle}
                    </p>
                  ) : null}
                </div>
              ))}
              {roomMembers.length < 2 ? (
                <span className="warm-pill">Invite friends with {group.inviteCode}</span>
              ) : null}
            </div>
          </div>

          <button
            className="mt-4 text-sm font-bold text-[#315c48]"
            onClick={() => setShowMemberForm((current) => !current)}
            type="button"
          >
            {showMemberForm ? "Hide planning reader form" : "Add planning reader"}
          </button>

          {showMemberForm ? (
            <form className="room-card mt-3 grid gap-3 p-4" onSubmit={handleAddMember}>
              <div>
                <p className="text-sm font-black text-ink">Add planning reader</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Add a placeholder reader for planning the room before real accounts are connected.
                </p>
              </div>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Name
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  onChange={(event) => setMemberName(event.target.value)}
                  placeholder="Friend name"
                  value={memberName}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Status
                  <select
                    className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                    onChange={(event) =>
                      setMemberStatus(event.target.value as MockGroupMember["readingStatus"])
                    }
                    value={memberStatus}
                  >
                    {memberStatuses.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Current book
                  <input
                    className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                    onChange={(event) => setMemberBookTitle(event.target.value)}
                    placeholder="Optional"
                    value={memberBookTitle}
                  />
                </label>
              </div>
              <button className="secondary-button justify-self-start" type="submit">
                Add reader
              </button>
            </form>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="primary-button" href="/today">
              Log a check-in
            </Link>
            <Link className="secondary-button" href="/groups">
              Back to groups
            </Link>
          </div>
          </div>
        </section>

        <section className="soft-card overflow-hidden" ref={discussionSectionRef}>
          <div className="border-b border-[#ded5c6] bg-[#fffdf8]/74 px-5 py-4">
            <p className="eyebrow">Discussion table</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Threads in this room</h2>
          </div>
          <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm leading-6 text-slate-700">
                Keep plot details intentional, and let quieter replies count too.
              </p>
            </div>
            {message ? (
              <p className="note-card px-3 py-2 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
          </div>

          <form className="room-card mt-5 grid gap-4 p-4" onSubmit={handleDiscussion}>
            <div>
              <h3 className="font-black text-ink">Start a room discussion</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                Post a focused prompt from inside this room. Spoiler labels stay visible before anyone opens the thread.
              </p>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Prompt
              <textarea
                className="min-h-24 rounded-app border border-[#dedbd2] px-3 py-2"
                onChange={(event) => {
                  setDiscussionBody(event.target.value);
                  setShouldReplaceDiscussionDraft(false);
                }}
                ref={discussionTextareaRef}
                value={discussionBody}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Saved book
                <select
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  onChange={(event) => setRelatedBookId(event.target.value)}
                  value={relatedBookId}
                >
                  <option value="">Use current room book</option>
                  {state.books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Spoiler level
                <select
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  onChange={(event) => setSpoilerLevel(event.target.value as SpoilerLevel)}
                  value={spoilerLevel}
                >
                  {spoilerLevels.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {selectedDiscussionBook ? (
              <div className="note-card grid gap-3 p-3 sm:grid-cols-[3.5rem_1fr]">
                <BookCover book={selectedDiscussionBook} size="small" />
                <div>
                  <p className="text-xs font-black uppercase text-[#315c48]">Attached book</p>
                  <p className="text-sm font-black text-ink">{selectedDiscussionBook.title}</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedDiscussionBook.author || "Unknown author"}
                    {shortPublishedDate(selectedDiscussionBook)
                      ? ` - ${shortPublishedDate(selectedDiscussionBook)}`
                      : ""}
                  </p>
                  {bookEditionLine(selectedDiscussionBook) ? (
                    <p className="mt-1 text-sm font-bold text-slate-600">
                      {bookEditionLine(selectedDiscussionBook)}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm font-bold text-slate-600">
                      Edition details not saved yet.
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {bookMetadataPills(selectedDiscussionBook).slice(0, 3).map((item) => (
                      <span className="status-pill" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
            <button
              className="text-sm font-bold text-[#315c48]"
              onClick={() => setShowBookSearch((current) => !current)}
              type="button"
            >
              {showBookSearch ? "Hide book search" : "Find another book"}
            </button>
            {showBookSearch ? (
              <div className="note-card grid gap-4 p-4">
                <div>
                  <h4 className="font-black text-ink">Find a book for this room</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Search the catalog without leaving the group page, then attach the result to this discussion.
                  </p>
                </div>
                <div className="grid gap-3">
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Book search
                    <input
                      className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                      onChange={(event) => setBookSearchQuery(event.target.value)}
                      placeholder="Title, author, subject, or ISBN"
                      value={bookSearchQuery}
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-[0.45fr_0.35fr_0.2fr]">
                    <label className="grid gap-2 text-sm font-bold text-slate-700">
                      Search by
                      <select
                        className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                        onChange={(event) => setBookSearchMode(event.target.value)}
                        value={bookSearchMode}
                      >
                        {bookSearchModes.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-slate-700">
                      Sort
                      <select
                        className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                        onChange={(event) => setBookSearchOrderBy(event.target.value)}
                        value={bookSearchOrderBy}
                      >
                        {bookSearchSortOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="secondary-button self-end"
                      disabled={isBookSearching}
                      onClick={() => handleBookSearch(0)}
                      type="button"
                    >
                      {isBookSearching ? "Searching" : "Search"}
                    </button>
                  </div>
                </div>
                {bookSearchMessage ? (
                  <p className="text-sm text-slate-700">{bookSearchMessage}</p>
                ) : null}
                {bookSearchResults.length ? (
                  <div className="grid gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-bold text-slate-600">
                        {bookSearchResults.length} shown
                        {bookSearchTotalItems
                          ? ` from ${bookSearchTotalItems.toLocaleString()} matches`
                          : ""}
                      </p>
                      {nextBookSearchStartIndex !== null ? (
                        <button
                          className="secondary-button"
                          disabled={isBookSearching}
                          onClick={() => handleBookSearch(nextBookSearchStartIndex)}
                          type="button"
                        >
                          {isBookSearching ? "Loading" : "Load more"}
                        </button>
                      ) : null}
                    </div>
                    {bookSearchResults.map((book) => (
                      <article className="room-card grid gap-3 p-3 sm:grid-cols-[3.5rem_1fr]" key={book.id}>
                        <div
                          aria-label={book.title}
                          className="min-h-16 rounded-app border border-[#ded5c6] bg-[#f2e7d8] bg-cover bg-center"
                          role="img"
                          style={book.thumbnail ? { backgroundImage: `url(${book.thumbnail})` } : undefined}
                        />
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h5 className="font-black text-ink">{book.title}</h5>
                              <p className="mt-1 text-sm text-slate-700">
                                {book.author || "Unknown author"}
                                {book.publishedDate ? ` - ${book.publishedDate}` : ""}
                              </p>
                            </div>
                            {book.pageCount ? (
                              <span className="status-pill">{book.pageCount} pages</span>
                            ) : null}
                          </div>
                          <button
                            className="secondary-button mt-3"
                            onClick={() => attachCatalogBook(book)}
                            type="button"
                          >
                            Attach book
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Spoiler page
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  min="0"
                  onChange={(event) => setSpoilerPage(event.target.value)}
                  type="number"
                  value={spoilerPage}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Spoiler chapter
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  min="0"
                  onChange={(event) => setSpoilerChapter(event.target.value)}
                  type="number"
                  value={spoilerChapter}
                />
              </label>
            </div>
            <button className="primary-button justify-self-start" type="submit">
              Start discussion
            </button>
          </form>

          <div className="mt-5 grid gap-4">
            {posts.length ? (
              posts.map((post) => {
                const comments =
                  state.discussionComments.filter((comment) => comment.postId === post.id);
                const isProtected = post.spoilerLevel !== "none";
                const isRevealed = revealedPostIds.has(post.id);
                const attachedBook = state.books.find((book) => book.id === post.relatedBookId);

                return (
                  <article className="note-card p-4" key={post.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-ink">{post.authorName}</h3>
                      <span className="status-pill">
                        {formatSpoilerLabel(post.spoilerLevel)}
                      </span>
                      <span className="warm-pill">
                        {comments.length} {comments.length === 1 ? "reply" : "replies"}
                      </span>
                    </div>

                    {isProtected && !isRevealed ? (
                      <div className="spoiler-panel mt-3 p-4">
                        <p className="text-sm font-bold text-[#7c4a20]">
                          This thread is spoiler-protected.
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          Open it only when you are ready for this part of the reading.
                        </p>
                        <button
                          className="secondary-button mt-3"
                          onClick={() => toggleReveal(post.id)}
                          type="button"
                        >
                          Reveal thread
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="mt-3 text-sm leading-6 text-slate-700">{post.body}</p>
                        {isProtected ? (
                          <button
                            className="mt-3 text-sm font-bold text-[#315c48]"
                            onClick={() => toggleReveal(post.id)}
                            type="button"
                          >
                            Hide spoiler again
                          </button>
                        ) : null}
                      </>
                    )}

                    {attachedBook ? (
                      <div className="room-card mt-4 grid gap-3 p-3 sm:grid-cols-[4rem_1fr]">
                        <BookCover book={attachedBook} size="small" />
                        <div>
                          <p className="text-xs font-black uppercase text-[#315c48]">
                            Book in this thread
                          </p>
                          <p className="mt-1 text-sm font-black text-ink">{attachedBook.title}</p>
                          <p className="mt-1 text-sm text-slate-700">
                            {attachedBook.author || "Unknown author"}
                            {shortPublishedDate(attachedBook)
                              ? ` - ${shortPublishedDate(attachedBook)}`
                              : ""}
                          </p>
                          {bookDescriptionExcerpt(attachedBook) ? (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-700">
                              Book note: {bookDescriptionExcerpt(attachedBook)}
                            </p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2">
                            {bookMetadataPills(attachedBook).slice(0, 3).map((item) => (
                              <span className="status-pill" key={item}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : post.relatedBookTitle ? (
                      <p className="mt-3 text-sm font-bold text-slate-600">
                        Attached to {post.relatedBookTitle}
                      </p>
                    ) : null}

                    <div className="mt-4 grid gap-2 border-t border-[#dedbd2] pt-4">
                      {comments.length ? (
                        comments.map((comment) => (
                          <div className="room-card p-3" key={comment.id}>
                            <p className="text-xs font-black uppercase text-[#315c48]">
                              {comment.authorName}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">{comment.body}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-600">
                          No replies yet. Leave a short note when you are ready.
                        </p>
                      )}

                      <form className="mt-2 grid gap-2" onSubmit={(event) => handleReply(event, post.id)}>
                        <label className="grid gap-2 text-sm font-bold text-slate-700">
                          Reply in this room
                          <textarea
                            className="min-h-20 rounded-app border border-[#dedbd2] px-3 py-2"
                            onChange={(event) =>
                              setReplyDrafts((current) => ({
                                ...current,
                                [post.id]: event.target.value
                              }))
                            }
                            placeholder="Add a thoughtful reply"
                            value={replyDrafts[post.id] ?? ""}
                          />
                        </label>
                        <button className="secondary-button justify-self-start" type="submit">
                          Add reply
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="room-card p-5">
                <h3 className="font-black text-ink">No threads yet</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  No room notes yet. Start with this week&apos;s table prompt, or leave a quiet reply when you are ready.
                </p>
              </div>
            )}
          </div>
          </div>
        </section>

        <section className="soft-card p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Room notes</p>
              <h2 className="mt-3 text-xl font-black text-ink">Recent notes</h2>
            </div>
            <span className="warm-pill">
              {activities.length} notes
            </span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {activities.length ? (
              activities.map((activity) => (
                <article className="note-card p-4" key={activity.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-ink">{activity.actorName}</h3>
                    <span className="warm-pill">
                      {activity.type === "check_in" ? "Check-in" : "Discussion"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{activity.summary}</p>
                  {activity.bookTitle ? (
                    <p className="mt-1 text-sm font-bold text-slate-600">{activity.bookTitle}</p>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="note-card p-4 text-slate-700">
                Group check-ins and discussions will appear here as this room gets used.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
