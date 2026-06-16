import {
  addMockBook,
  addMockDiscussionComment,
  addMockDiscussionPost,
  addMockReadingLog,
  clearMockState,
  createMockGroup,
  getMostRecentBook,
  joinMockGroup,
  readMockState,
  saveMockProfile,
  signInMockUser
} from "@/lib/mock-app-state";
import type {
  CheckInUnit,
  CheckInVisibility,
  MockAppState,
  MockProfile,
  ReadingFormat,
  ReadingGoalType,
  SpoilerLevel
} from "@/lib/mock-app-state";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export type {
  CheckInUnit,
  CheckInVisibility,
  MockAppState,
  MockProfile,
  ReadingFormat,
  ReadingGoalType,
  SpoilerLevel
};

export type AddBookInput = {
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
};

export type AddReadingLogInput = {
  userBookId: string;
  unit: CheckInUnit;
  amount: number;
  skipped: boolean;
  visibility: CheckInVisibility;
  note: string;
};

export type AddDiscussionPostInput = {
  groupId: string;
  body: string;
  relatedBookId: string | null;
  spoilerLevel: SpoilerLevel;
  spoilerPage?: number | null;
  spoilerChapter?: number | null;
};

export type ReadingMomentumRepository = {
  mode: "local" | "supabase_pending";
  getState(): Promise<MockAppState>;
  getMostRecentBook(state: MockAppState): ReturnType<typeof getMostRecentBook>;
  signIn(email: string): Promise<MockAppState>;
  saveProfile(profile: MockProfile): Promise<MockAppState>;
  createGroup(name: string, description: string): Promise<MockAppState>;
  joinGroup(inviteCode: string): Promise<MockAppState>;
  addBook(input: AddBookInput): Promise<MockAppState>;
  addReadingLog(input: AddReadingLogInput): Promise<MockAppState>;
  addDiscussionPost(input: AddDiscussionPostInput): Promise<MockAppState>;
  addDiscussionComment(input: { postId: string; body: string }): Promise<MockAppState>;
  clearSession(): Promise<void>;
};

function createLocalRepository(): ReadingMomentumRepository {
  return {
    mode: hasSupabaseEnv() ? "supabase_pending" : "local",
    async getState() {
      return readMockState();
    },
    getMostRecentBook(state) {
      return getMostRecentBook(state);
    },
    async signIn(email) {
      return signInMockUser(email);
    },
    async saveProfile(profile) {
      return saveMockProfile(profile);
    },
    async createGroup(name, description) {
      return createMockGroup(name, description);
    },
    async joinGroup(inviteCode) {
      return joinMockGroup(inviteCode);
    },
    async addBook(input) {
      return addMockBook(input);
    },
    async addReadingLog(input) {
      return addMockReadingLog(input);
    },
    async addDiscussionPost(input) {
      return addMockDiscussionPost(input);
    },
    async addDiscussionComment(input) {
      return addMockDiscussionComment(input);
    },
    async clearSession() {
      clearMockState();
    }
  };
}

const repository = createLocalRepository();

export function getRepository(): ReadingMomentumRepository {
  return repository;
}
