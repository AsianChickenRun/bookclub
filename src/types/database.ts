export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  favorite_genres: string[];
  timezone: string;
  total_xp: number;
  current_streak_days: number;
  longest_streak_days: number;
  created_at: string;
  updated_at: string;
};

export type ReadingGroup = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  invite_code: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  status: "invited" | "active" | "left" | "removed";
  joined_at: string;
  last_seen_at: string | null;
};

export type Book = {
  id: string;
  title: string;
  author: string | null;
  isbn_10: string | null;
  isbn_13: string | null;
  cover_url: string | null;
  default_page_count: number | null;
  default_chapter_count: number | null;
  genres: string[];
  created_by: string | null;
  created_at: string;
};

export type UserBook = {
  id: string;
  user_id: string;
  book_id: string;
  status: "current" | "paused" | "finished" | "abandoned";
  format: "print" | "ebook" | "audiobook" | "mixed";
  goal_type: "pages" | "chapters" | "minutes" | "sessions";
  total_pages: number | null;
  total_chapters: number | null;
  current_page: number | null;
  current_chapter: number | null;
  minutes_read_total: number;
  sessions_total: number;
  started_at: string;
  target_finish_date: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReadingLog = {
  id: string;
  user_id: string;
  user_book_id: string | null;
  group_id: string | null;
  logged_for_date: string;
  pages_read: number;
  chapters_read: number;
  minutes_read: number;
  audiobook_minutes: number;
  session_completed: boolean;
  skipped: boolean;
  note: string | null;
  visibility: "private" | "groups";
  created_at: string;
};

export type Activity = {
  id: string;
  group_id: string;
  actor_id: string | null;
  activity_type: "check_in" | "discussion";
  related_reading_log_id: string | null;
  related_discussion_post_id: string | null;
  book_id: string | null;
  summary: string;
  spoiler_level: "none" | "progress_locked" | "explicit";
  spoiler_page: number | null;
  spoiler_chapter: number | null;
  created_at: string;
};

export type DiscussionPost = {
  id: string;
  group_id: string;
  author_id: string;
  book_id: string | null;
  body: string;
  spoiler_level: "none" | "progress_locked" | "explicit";
  spoiler_page: number | null;
  spoiler_chapter: number | null;
  created_at: string;
  updated_at: string;
};

export type DiscussionComment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};
