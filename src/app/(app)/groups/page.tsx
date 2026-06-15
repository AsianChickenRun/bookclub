"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  addMockDiscussionPost,
  createMockGroup,
  joinMockGroup,
  MockAppState,
  readMockState,
  SpoilerLevel
} from "@/lib/mock-app-state";

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

  useEffect(() => {
    setState(readMockState());
  }, []);

  const activeGroup = state?.groups[0];
  const activeActivities = activeGroup
    ? state.activities.filter((activity) => activity.groupId === activeGroup.id).slice(0, 8)
    : [];
  const activePosts = activeGroup
    ? state.discussionPosts.filter((post) => post.groupId === activeGroup.id).slice(0, 4)
    : [];

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState(createMockGroup(name.trim() || "Untitled group", description.trim()));
  }

  function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState(joinMockGroup(inviteCode));
  }

  function handleDiscussion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeGroup) {
      setMessage("Create or join a group before starting a discussion.");
      return;
    }

    if (!discussionBody.trim()) {
      setMessage("Add a discussion prompt before posting.");
      return;
    }

    const nextState = addMockDiscussionPost({
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
        description="Sprint 3 connects group-visible check-ins to activity and adds a lightweight discussion foundation with spoiler metadata."
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
            Create local group
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
            Join local group
          </button>
        </form>
        <section className="soft-card p-5 lg:row-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Active group</p>
              <h2 className="mt-2 text-xl font-black text-ink">
                {activeGroup?.name ?? "No group selected"}
              </h2>
            </div>
            {activeGroup ? (
              <span className="rounded-app bg-skysoft px-3 py-1 text-xs font-black text-moss">
                {activeGroup.role}
              </span>
            ) : null}
          </div>

          <form className="mt-5 grid gap-4 rounded-app border border-[#dedbd2] bg-white p-4" onSubmit={handleDiscussion}>
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
              <p className="rounded-app border border-[#dedbd2] bg-[#f7f3ea] p-3 text-sm text-slate-700">
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
                  <article className="rounded-app border border-[#dedbd2] bg-white p-4" key={activity.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-ink">{activity.actorName}</h4>
                      <span className="rounded-app bg-[#f7f3ea] px-2 py-1 text-xs font-bold text-slate-700">
                        {activity.type === "check_in" ? "Check-in" : "Discussion"}
                      </span>
                      <span className="rounded-app bg-skysoft px-2 py-1 text-xs font-bold text-moss">
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
                <p className="rounded-app border border-[#dedbd2] bg-white p-4 text-slate-700">
                  Group-visible check-ins and discussions will appear here.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="soft-card p-5">
          <h2 className="text-xl font-black text-ink">Your groups</h2>
          <div className="mt-4 grid gap-3">
            {state?.groups.length ? (
              state.groups.map((group) => (
                <article className="rounded-app border border-[#dedbd2] bg-white p-4" key={group.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-ink">{group.name}</h3>
                      <p className="mt-1 text-sm text-slate-700">{group.description}</p>
                    </div>
                    <span className="rounded-app bg-skysoft px-3 py-1 text-xs font-black text-moss">
                      {group.role}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">Invite: {group.inviteCode}</p>
                </article>
              ))
            ) : (
              <p className="rounded-app border border-[#dedbd2] bg-white p-4 text-slate-700">
                No groups yet. Create or join one to unlock the Sprint 3 feed.
              </p>
            )}
          </div>
        </section>
        <section className="soft-card p-5 lg:col-start-2">
          <h2 className="text-xl font-black text-ink">Discussion posts</h2>
          <div className="mt-4 grid gap-3">
            {activePosts.length ? (
              activePosts.map((post) => (
                <article className="rounded-app border border-[#dedbd2] bg-white p-4" key={post.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-ink">{post.authorName}</h3>
                    <span className="rounded-app bg-skysoft px-2 py-1 text-xs font-bold text-moss">
                      {formatSpoilerLabel(post.spoilerLevel)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{post.body}</p>
                  {post.relatedBookTitle ? (
                    <p className="mt-2 text-sm font-bold text-slate-600">
                      Attached to {post.relatedBookTitle}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="rounded-app border border-[#dedbd2] bg-white p-4 text-slate-700">
                No discussions yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
