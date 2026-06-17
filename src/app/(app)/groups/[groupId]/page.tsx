"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  getRepository,
  type MockAppState,
  type SpoilerLevel
} from "@/lib/persistence/repository";

const spoilerLevels: { value: SpoilerLevel; label: string }[] = [
  { value: "none", label: "No spoilers" },
  { value: "progress_locked", label: "Progress locked" },
  { value: "explicit", label: "Explicit spoiler" }
];

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

export default function GroupRoomPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const [state, setState] = useState<MockAppState | null>(null);
  const [message, setMessage] = useState("");
  const [revealedPostIds, setRevealedPostIds] = useState<Set<string>>(new Set());
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [discussionBody, setDiscussionBody] = useState(
    "What moment from your current reading would be good to talk through together?"
  );
  const [relatedBookId, setRelatedBookId] = useState("");
  const [spoilerLevel, setSpoilerLevel] = useState<SpoilerLevel>("none");
  const [spoilerPage, setSpoilerPage] = useState("");
  const [spoilerChapter, setSpoilerChapter] = useState("");

  useEffect(() => {
    getRepository().getState().then(setState);
  }, []);

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
  const memberRoster = useMemo(() => {
    if (!state) return [];

    const names = new Set<string>();
    names.add(state.profile?.displayName ?? "You");

    activities.forEach((activity) => names.add(activity.actorName));
    posts.forEach((post) => names.add(post.authorName));
    state.discussionComments
      .filter((comment) => posts.some((post) => post.id === comment.postId))
      .forEach((comment) => names.add(comment.authorName));

    return Array.from(names).slice(0, 6);
  }, [activities, posts, state]);
  const sessionPrompt = currentBook
    ? `What changed in your thinking while reading ${currentBook.title}?`
    : "What would make this week's reading feel easier to return to?";
  const lastSeven = recentDateKeys(7);
  const groupCheckIns =
    state?.readingLogs.filter(
      (log) => log.visibility === "groups" && lastSeven.includes(log.loggedForDate)
    ) ?? [];
  const totalReplies =
    state?.discussionComments.filter((comment) =>
      posts.some((post) => post.id === comment.postId)
    ).length ?? 0;

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
            <div>
              <p className="eyebrow">Session focus</p>
              <h2 className="mt-3 text-2xl font-black text-ink">
                {currentBook ? currentBook.title : "Choose a current book"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {currentBook
                  ? `Use this room to check in, discuss, and keep spoilers clear around ${currentBook.author || "this book"}.`
                  : "Add a current book so the room can center around real reading progress."}
              </p>
              {currentBook?.categories.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentBook.categories.slice(0, 2).map((category) => (
                    <span className="warm-pill" key={category}>
                      {category}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="status-pill">
              {group.role}
            </span>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="metric-card p-4">
              <dt className="text-xs font-bold text-slate-500">Group check-ins</dt>
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

          <div className="room-card mt-6 p-4">
            <p className="text-sm font-black text-ink">This week&apos;s room rhythm</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
              <li>Check in after reading, even if it is only a few pages.</li>
              <li>Use progress-locked or explicit spoiler labels before posting plot details.</li>
              <li>Reply to one person before starting a new thread.</li>
            </ul>
          </div>

          <div className="room-card mt-4 p-4">
            <p className="text-sm font-black text-ink">Session prompt</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{sessionPrompt}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-black text-ink">Local room roster</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {memberRoster.map((name) => (
                <span className="status-pill" key={name}>
                  {name}
                </span>
              ))}
              {memberRoster.length < 2 ? (
                <span className="warm-pill">Invite friends with {group.inviteCode}</span>
              ) : null}
            </div>
          </div>

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

        <section className="soft-card overflow-hidden">
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
                onChange={(event) => setDiscussionBody(event.target.value)}
                value={discussionBody}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Related book
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

                    {post.relatedBookTitle ? (
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
                          No replies yet. Help the room feel alive with a quick response.
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
                  Start the first discussion above so this room has a focused place for replies.
                </p>
              </div>
            )}
          </div>
          </div>
        </section>

        <section className="soft-card p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Room activity</p>
              <h2 className="mt-3 text-xl font-black text-ink">Latest signals</h2>
            </div>
            <span className="warm-pill">
              {activities.length} updates
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
