import type {
  AddBookInput,
  AddDiscussionPostInput,
  AddReadingLogInput,
  ReadingMomentumRepository
} from "./repository";
import type { MockAppState, MockProfile } from "@/lib/mock-app-state";

type RepositoryContract = {
  mode: "local" | "supabase_pending";
  getState(): Promise<MockAppState>;
  getMostRecentBook(state: MockAppState): MockAppState["books"][number] | undefined;
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

const _repositoryContract: RepositoryContract = {} as ReadingMomentumRepository;

void _repositoryContract;
