"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
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

export default function GroupsPage() {
  const [state, setState] = useState<MockAppState | null>(null);
  const [name, setName] = useState("Weekend Readers");
  const [description, setDescription] = useState("A small private group for staying consistent.");
  const [inviteCode, setInviteCode] = useState("DEMO2026");
  const [discussionBody, setDiscussionBody] = useState(
    "What part of your current book has stayed with you today?"
  );
  const [relatedBookId, setRelatedBookId] = useState("");
  const [spoilerLevel, setSpoilerLevel] = useState<SpoilerLevel>("none");
  const [spoilerPage, setSpoilerPage] = useState("");
  const [spoilerChapter, setSpoilerChapter] = useState("");
  const [message, setMessage] = useState("");
  const [activeGroupId, setActiveGroupId] = useState("");
  const [revealedPostIds, setRevealedPostIds] = useState<Set<string>>(new Set());
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    getRepository().getState().then((nextState) => {
      setState(nextState);
      setActiveGroupId(nextState.groups[0]?.id ?? "");
    });
  }, []);

  const activeGroup =
    state?.groups.find((group) => group.id === activeGroupId) ?? state?.groups[0];
  const activeActivities = state && activeGroup
    ? state.activities.filter((activity) => activity.groupId === activeGroup.id).slice(0, 8)
    : [];
  const activePosts = state && activeGroup
    ? state.discussionPosts.filter((post) => post.groupId === activeGroup.id).slice(0, 4)
    : [];

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextState = await getRepository().createGroup(
      name.trim() || "Untitled group",
      description.trim()
    );
    setState(nextState);
    setActiveGroupId(nextState.groups[0]?.id ?? "");
    setMessage("Group created.");
  }

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextState = await getRepository().joinGroup(inviteCode);
    setState(nextState);
    setActiveGroupId(nextState.groups[0]?.id ?? "");
    setMessage("Group joined.");
  }

  async function handleDiscussion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeGroup) {
      setMessage("Create or join a group before starting a discussion.");
      return;
    }

    if (!discussionBody.trim()) {
      setMessage("Add a discussion prompt before posting.");
      return;
    }

    const nextState = await getRepository().addDiscussionPost({
      groupId: activeGroup.id,
      body: discussionBody.trim(),
      relatedBookId: relatedBookId || null,
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
    setMessage("Discussion posted to the group feed.");
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
    setMessage("Reply added.");
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

  function formatSpoilerLabel(level: SpoilerLevel) {
    if (level === "progress_locked") {
      return "Progress locked";
    }

    if (level === "explicit") {
      return "Explicit spoiler";
    }

    return "No spoilers";
  }

  return (
    <>
      <PageHeader
        eyebrow="Group"
        title="Private groups with a living feed."
        description="Create a private room, share group-visible check-ins, and start spoiler-aware discussions with friends."
      />
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <form className="soft-card grid gap-4 p-5" onSubmit={handleCreate}>
          <h2 className="text-xl font-black text-ink">Create a group</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Group name
            <input
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Description
            <textarea
              className="min-h-24 rounded-app border border-[#dedbd2] px-3 py-2"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>
          <button className="primary-button" type="submit">
            Create group
          </button>
        </form>
        <form className="soft-card grid gap-4 p-5" onSubmit={handleJoin}>
          <h2 className="text-xl font-black text-ink">Join a group</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Invite code
            <input
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setInviteCode(event.target.value)}
              value={inviteCode}
            />
          </label>
          <button className="secondary-button" type="submit">
            Join group
          </button>
        </form>
        <section className="soft-card overflow-hidden lg:row-span-2">
          <div className="border-b border-[#ded5c6] bg-[#f2e7d8]/60 px-5 py-4">
            <p className="eyebrow">Reading room preview</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Pick a group, post a thoughtful prompt, then open the room for replies and activity.
            </p>
          </div>
          <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Active group</p>
              <h2 className="mt-2 text-xl font-black text-ink">
                {activeGroup?.name ?? "No group selected"}
              </h2>
            </div>
            {activeGroup ? (
              <span className="status-pill">
                {activeGroup.role}
              </span>
            ) : null}
          </div>

          {state?.groups.length ? (
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {state.groups.map((group) => (
                <button
                  className={`rounded-app border px-3 py-2 text-sm font-bold ${
                    activeGroup?.id === group.id
                      ? "border-[#315c48] bg-[#315c48] text-white"
                      : "border-[#dedbd2] bg-[#fffdf8] text-slate-700"
                  }`}
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  type="button"
                >
                  {group.name}
                </button>
              ))}
            </div>
          ) : null}

          <form className="room-card mt-5 grid gap-4 p-4" onSubmit={handleDiscussion}>
            <h3 className="font-black text-ink">Start a discussion</h3>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Prompt
              <textarea
                className="min-h-24 rounded-app border border-[#dedbd2] px-3 py-2"
                onChange={(event) => setDiscussionBody(event.target.value)}
                value={discussionBody}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Related book
              <select
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setRelatedBookId(event.target.value)}
                value={relatedBookId}
              >
                <option value="">No book attached</option>
                {state?.books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Spoiler
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
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Page
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  min="0"
                  onChange={(event) => setSpoilerPage(event.target.value)}
                  type="number"
                  value={spoilerPage}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Chapter
                <input
                  className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                  min="0"
                  onChange={(event) => setSpoilerChapter(event.target.value)}
                  type="number"
                  value={spoilerChapter}
                />
              </label>
            </div>
            {message ? (
              <p className="note-card p-3 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
            <button className="primary-button" type="submit">
              Post discussion
            </button>
          </form>

          <div className="mt-5">
            <h3 className="font-black text-ink">Recent activity</h3>
            <div className="mt-3 grid gap-3">
              {activeActivities.length ? (
                activeActivities.map((activity) => (
                  <article className="note-card p-4" key={activity.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-ink">{activity.actorName}</h4>
                      <span className="warm-pill">
                        {activity.type === "check_in" ? "Check-in" : "Discussion"}
                      </span>
                      <span className="status-pill">
                        {formatSpoilerLabel(activity.spoilerLevel)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{activity.summary}</p>
                    {activity.bookTitle ? (
                      <p className="mt-1 text-sm font-bold text-slate-600">{activity.bookTitle}</p>
                    ) : null}
                  </article>
                ))
              ) : (
                <p className="note-card p-4 text-slate-700">
                  Group-visible check-ins and discussions will appear here.
                </p>
              )}
            </div>
          </div>
          </div>
        </section>

        <section className="soft-card p-5">
          <h2 className="text-xl font-black text-ink">Your groups</h2>
          <div className="mt-4 grid gap-3">
            {state?.groups.length ? (
              state.groups.map((group) => (
                <article className="note-card p-4" key={group.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-ink">{group.name}</h3>
                      <p className="mt-1 text-sm text-slate-700">{group.description}</p>
                    </div>
                    <span className="status-pill">
                      {group.role}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Invite: {group.inviteCode}</p>
                  <Link className="secondary-button mt-4 w-full" href={`/groups/${group.id}`}>
                    Open group room
                  </Link>
                </article>
              ))
            ) : (
              <p className="note-card p-4 text-slate-700">
                No groups yet. Create or join one to unlock the group feed.
              </p>
            )}
          </div>
        </section>
        <section className="soft-card p-5 lg:col-start-2">
          <h2 className="text-xl font-black text-ink">Discussion posts</h2>
          <div className="mt-4 grid gap-3">
            {activePosts.length ? (
              activePosts.map((post) => {
                const comments =
                  state?.discussionComments.filter((comment) => comment.postId === post.id) ?? [];
                const isProtected = post.spoilerLevel !== "none";
                const isRevealed = revealedPostIds.has(post.id);

                return (
                  <article className="note-card p-4" key={post.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-ink">{post.authorName}</h3>
                      <span className="status-pill">
                        {formatSpoilerLabel(post.spoilerLevel)}
                      </span>
                      {comments.length ? (
                        <span className="warm-pill">
                          {comments.length} {comments.length === 1 ? "reply" : "replies"}
                        </span>
                      ) : null}
                    </div>
                    {isProtected && !isRevealed ? (
                      <div className="spoiler-panel mt-3 p-4">
                        <p className="text-sm font-bold text-[#7c4a20]">
                          This discussion may contain spoilers.
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          Reveal only if you are ready for this part of the book.
                        </p>
                        <button
                          className="secondary-button mt-3"
                          onClick={() => toggleReveal(post.id)}
                          type="button"
                        >
                          Reveal discussion
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="mt-2 text-sm text-slate-700">{post.body}</p>
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
                      <p className="mt-2 text-sm font-bold text-slate-600">
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
                          No replies yet. Add a quick thought or encouragement.
                        </p>
                      )}
                      <form className="mt-2 grid gap-2" onSubmit={(event) => handleReply(event, post.id)}>
                        <label className="grid gap-2 text-sm font-bold text-slate-700">
                          Reply
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
              <p className="note-card p-4 text-slate-700">
                No discussions yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
