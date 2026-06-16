export type MockUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type MockProfile = {
  displayName: string;
  favoriteGenres: string;
  timezone: string;
};

export type MockGroup = {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  role: "owner" | "member";
};

export type ReadingFormat = "print" | "ebook" | "audiobook" | "mixed";

export type ReadingGoalType = "pages" | "chapters" | "minutes" | "sessions";

export type CheckInUnit =
  | "pages"
  | "chapters"
  | "minutes"
  | "audiobook_minutes"
  | "sessions";

export type CheckInVisibility = "private" | "groups";

export type SpoilerLevel = "none" | "progress_locked" | "explicit";

export type MockUserBook = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  format: ReadingFormat;
  goalType: ReadingGoalType;
  totalPages: number | null;
  totalChapters: number | null;
  currentPage: number | null;
  currentChapter: number | null;
  minutesReadTotal: number;
  sessionsTotal: number;
  status: "current" | "paused" | "finished";
  startedAt: string;
  updatedAt: string;
};

export type MockReadingLog = {
  id: string;
  userBookId: string;
  loggedForDate: string;
  unit: CheckInUnit;
  amount: number;
  skipped: boolean;
  visibility: CheckInVisibility;
  note: string;
  createdAt: string;
};

export type MockActivity = {
  id: string;
  groupId: string;
  actorName: string;
  type: "check_in" | "discussion";
  summary: string;
  bookTitle: string | null;
  relatedId: string;
  spoilerLevel: SpoilerLevel;
  spoilerPage: number | null;
  spoilerChapter: number | null;
  createdAt: string;
};

export type MockDiscussionPost = {
  id: string;
  groupId: string;
  authorName: string;
  body: string;
  relatedBookId: string | null;
  relatedBookTitle: string | null;
  spoilerLevel: SpoilerLevel;
  spoilerPage: number | null;
  spoilerChapter: number | null;
  createdAt: string;
};

export type MockDiscussionComment = {
  id: string;
  postId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type MockAppState = {
  user: MockUser | null;
  profile: MockProfile | null;
  groups: MockGroup[];
  books: MockUserBook[];
  readingLogs: MockReadingLog[];
  activities: MockActivity[];
  discussionPosts: MockDiscussionPost[];
  discussionComments: MockDiscussionComment[];
};

const STORAGE_KEY = "reading-momentum:sprint1";

const emptyState: MockAppState = {
  user: null,
  profile: null,
  groups: [],
  books: [],
  readingLogs: [],
  activities: [],
  discussionPosts: [],
  discussionComments: []
};

export function readMockState(): MockAppState {
  if (typeof window === "undefined") {
    return emptyState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return emptyState;
  }

  try {
    return { ...emptyState, ...JSON.parse(raw) } as MockAppState;
  } catch {
    return emptyState;
  }
}

export function writeMockState(nextState: MockAppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new Event("reading-momentum-state"));
}

export function signInMockUser(email: string) {
  const current = readMockState();
  const user: MockUser = {
    id: current.user?.id ?? crypto.randomUUID(),
    email,
    createdAt: current.user?.createdAt ?? new Date().toISOString()
  };

  const nextState = { ...current, user };
  writeMockState(nextState);
  return nextState;
}

export function saveMockProfile(profile: MockProfile) {
  const current = readMockState();
  const nextState = { ...current, profile };
  writeMockState(nextState);
  return nextState;
}

export function createMockGroup(name: string, description: string) {
  const current = readMockState();
  const group: MockGroup = {
    id: crypto.randomUUID(),
    name,
    description,
    inviteCode: Math.random().toString(16).slice(2, 10).toUpperCase(),
    role: "owner"
  };

  const nextState = { ...current, groups: [group, ...current.groups] };
  writeMockState(nextState);
  return nextState;
}

export function joinMockGroup(inviteCode: string) {
  const current = readMockState();
  const normalized = inviteCode.trim().toUpperCase();
  const group: MockGroup = {
    id: crypto.randomUUID(),
    name: `Invited group ${normalized.slice(0, 4) || "RM"}`,
    description: "Mock joined group for Sprint 1 local flow verification.",
    inviteCode: normalized || "DEMO2026",
    role: "member"
  };

  const nextState = { ...current, groups: [group, ...current.groups] };
  writeMockState(nextState);
  return nextState;
}

export function addMockBook(input: {
  title: string;
  author: string;
  format: ReadingFormat;
  goalType: ReadingGoalType;
  totalPages?: number | null;
  totalChapters?: number | null;
  currentPage?: number | null;
  currentChapter?: number | null;
  minutesReadTotal?: number;
  sessionsTotal?: number;
}) {
  const current = readMockState();
  const now = new Date().toISOString();
  const book: MockUserBook = {
    id: crypto.randomUUID(),
    bookId: crypto.randomUUID(),
    title: input.title,
    author: input.author,
    format: input.format,
    goalType: input.goalType,
    totalPages: input.totalPages ?? null,
    totalChapters: input.totalChapters ?? null,
    currentPage: input.currentPage ?? null,
    currentChapter: input.currentChapter ?? null,
    minutesReadTotal: input.minutesReadTotal ?? 0,
    sessionsTotal: input.sessionsTotal ?? 0,
    status: "current",
    startedAt: now.slice(0, 10),
    updatedAt: now
  };

  const nextState = { ...current, books: [book, ...current.books] };
  writeMockState(nextState);
  return nextState;
}

export function updateMockBook(book: MockUserBook) {
  const current = readMockState();
  const nextState = {
    ...current,
    books: current.books.map((item) => (item.id === book.id ? book : item))
  };
  writeMockState(nextState);
  return nextState;
}

export function addMockReadingLog(input: {
  userBookId: string;
  unit: CheckInUnit;
  amount: number;
  skipped: boolean;
  visibility: CheckInVisibility;
  note: string;
}) {
  const current = readMockState();
  const now = new Date();
  const group = input.visibility === "groups" ? current.groups[0] : undefined;
  const book = current.books.find((item) => item.id === input.userBookId);
  const log: MockReadingLog = {
    id: crypto.randomUUID(),
    userBookId: input.userBookId,
    loggedForDate: now.toISOString().slice(0, 10),
    unit: input.unit,
    amount: input.amount,
    skipped: input.skipped,
    visibility: input.visibility,
    note: input.note,
    createdAt: now.toISOString()
  };

  const books = current.books.map((book) => {
    if (book.id !== input.userBookId || input.skipped) {
      return book;
    }

    const nextBook: MockUserBook = { ...book, updatedAt: now.toISOString() };

    if (input.unit === "pages") {
      nextBook.currentPage = Math.max(nextBook.currentPage ?? 0, input.amount);
    }

    if (input.unit === "chapters") {
      nextBook.currentChapter = Math.max(nextBook.currentChapter ?? 0, input.amount);
    }

    if (input.unit === "minutes" || input.unit === "audiobook_minutes") {
      nextBook.minutesReadTotal += input.amount;
    }

    if (input.unit === "sessions") {
      nextBook.sessionsTotal += input.amount;
    }

    return nextBook;
  });

  const activity: MockActivity | null = group
    ? {
        id: crypto.randomUUID(),
        groupId: group.id,
        actorName: current.profile?.displayName ?? "Reader",
        type: "check_in",
        summary: input.skipped
          ? "Marked today as a skipped reading day."
          : `Checked in with ${input.amount} ${input.unit}.`,
        bookTitle: book?.title ?? null,
        relatedId: log.id,
        spoilerLevel: "none",
        spoilerPage: null,
        spoilerChapter: null,
        createdAt: now.toISOString()
      }
    : null;

  const nextState = {
    ...current,
    books,
    readingLogs: [log, ...current.readingLogs],
    activities: activity ? [activity, ...current.activities] : current.activities
  };
  writeMockState(nextState);
  return nextState;
}

export function addMockDiscussionPost(input: {
  groupId: string;
  body: string;
  relatedBookId: string | null;
  spoilerLevel: SpoilerLevel;
  spoilerPage?: number | null;
  spoilerChapter?: number | null;
}) {
  const current = readMockState();
  const now = new Date().toISOString();
  const relatedBook = current.books.find((book) => book.id === input.relatedBookId);
  const post: MockDiscussionPost = {
    id: crypto.randomUUID(),
    groupId: input.groupId,
    authorName: current.profile?.displayName ?? "Reader",
    body: input.body,
    relatedBookId: input.relatedBookId,
    relatedBookTitle: relatedBook?.title ?? null,
    spoilerLevel: input.spoilerLevel,
    spoilerPage: input.spoilerPage ?? null,
    spoilerChapter: input.spoilerChapter ?? null,
    createdAt: now
  };

  const activity: MockActivity = {
    id: crypto.randomUUID(),
    groupId: input.groupId,
    actorName: post.authorName,
    type: "discussion",
    summary: "Started a discussion.",
    bookTitle: post.relatedBookTitle,
    relatedId: post.id,
    spoilerLevel: post.spoilerLevel,
    spoilerPage: post.spoilerPage,
    spoilerChapter: post.spoilerChapter,
    createdAt: now
  };

  const nextState = {
    ...current,
    discussionPosts: [post, ...current.discussionPosts],
    activities: [activity, ...current.activities]
  };
  writeMockState(nextState);
  return nextState;
}

export function addMockDiscussionComment(input: { postId: string; body: string }) {
  const current = readMockState();
  const now = new Date().toISOString();
  const comment: MockDiscussionComment = {
    id: crypto.randomUUID(),
    postId: input.postId,
    authorName: current.profile?.displayName ?? "Reader",
    body: input.body,
    createdAt: now
  };

  const nextState = {
    ...current,
    discussionComments: [comment, ...current.discussionComments]
  };
  writeMockState(nextState);
  return nextState;
}

export function getMostRecentBook(state: MockAppState) {
  return [...state.books]
    .filter((book) => book.status === "current")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
}

export function clearMockState() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("reading-momentum-state"));
}
