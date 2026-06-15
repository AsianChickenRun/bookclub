"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";
import {
  addMockReadingLog,
  CheckInUnit,
  CheckInVisibility,
  getMostRecentBook,
  MockAppState,
  readMockState
} from "@/lib/mock-app-state";

const units: CheckInUnit[] = ["pages", "chapters", "minutes", "audiobook_minutes", "sessions"];

export default function TodayPage() {
  const [state, setState] = useState<MockAppState | null>(null);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [unit, setUnit] = useState<CheckInUnit>("pages");
  const [amount, setAmount] = useState("");
  const [skipped, setSkipped] = useState(false);
  const [visibility, setVisibility] = useState<CheckInVisibility>("private");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const nextState = readMockState();
    setState(nextState);
    setSelectedBookId(getMostRecentBook(nextState)?.id ?? "");
  }, []);

  const displayName = state?.profile?.displayName ?? "Reader";
  const currentBook = useMemo(() => {
    if (!state) {
      return undefined;
    }

    return state.books.find((book) => book.id === selectedBookId) ?? getMostRecentBook(state);
  }, [selectedBookId, state]);

  const groupCount = state?.groups.length ?? 0;
  const recentLogs = state?.readingLogs.slice(0, 5) ?? [];

  function handleCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentBook) {
      setMessage("Add a current book before checking in.");
      return;
    }

    const numericAmount = amount.trim() ? Number(amount) : 0;

    if (!skipped && (!Number.isFinite(numericAmount) || numericAmount <= 0)) {
      setMessage("Enter a reading amount greater than zero, or mark skipped today.");
      return;
    }

    if (skipped && numericAmount > 0) {
      setMessage("Skipped check-ins cannot include a positive reading amount.");
      return;
    }

    if (numericAmount < 0) {
      setMessage("Progress values must be zero or greater.");
      return;
    }

    if (unit === "pages" && currentBook.totalPages && numericAmount > currentBook.totalPages) {
      setMessage("That page is beyond the known total. Check the book details first.");
      return;
    }

    if (
      unit === "chapters" &&
      currentBook.totalChapters &&
      numericAmount > currentBook.totalChapters
    ) {
      setMessage("That chapter is beyond the known total. Check the book details first.");
      return;
    }

    const nextState = addMockReadingLog({
      userBookId: currentBook.id,
      unit,
      amount: skipped ? 0 : numericAmount,
      skipped,
      visibility,
      note: note.trim()
    });

    setState(nextState);
    setSelectedBookId(currentBook.id);
    setAmount("");
    setSkipped(false);
    setNote("");
    setMessage(skipped ? "Skipped today saved without shame." : "Check-in saved.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title={`Good to see you, ${displayName}.`}
        description="Sprint 2 adds the first local reading habit loop: current books, quick check-ins, visibility, and reading history."
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        {currentBook ? (
          <section className="soft-card p-5">
            <p className="eyebrow">Current book</p>
            <h2 className="mt-3 text-2xl font-black text-ink">{currentBook.title}</h2>
            <p className="mt-2 text-slate-700">
              {currentBook.author || "Unknown author"} · {currentBook.format} ·{" "}
              {currentBook.goalType}
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-app border border-[#dedbd2] bg-white p-3">
                <dt className="text-xs font-bold text-slate-500">Page</dt>
                <dd className="mt-1 font-black text-ink">
                  {currentBook.currentPage ?? "?"}
                  {currentBook.totalPages ? ` / ${currentBook.totalPages}` : ""}
                </dd>
              </div>
              <div className="rounded-app border border-[#dedbd2] bg-white p-3">
                <dt className="text-xs font-bold text-slate-500">Chapter</dt>
                <dd className="mt-1 font-black text-ink">
                  {currentBook.currentChapter ?? "?"}
                  {currentBook.totalChapters ? ` / ${currentBook.totalChapters}` : ""}
                </dd>
              </div>
              <div className="rounded-app border border-[#dedbd2] bg-white p-3">
                <dt className="text-xs font-bold text-slate-500">Minutes</dt>
                <dd className="mt-1 font-black text-ink">{currentBook.minutesReadTotal}</dd>
              </div>
              <div className="rounded-app border border-[#dedbd2] bg-white p-3">
                <dt className="text-xs font-bold text-slate-500">Sessions</dt>
                <dd className="mt-1 font-black text-ink">{currentBook.sessionsTotal}</dd>
              </div>
            </dl>
          </section>
        ) : (
          <PlaceholderCard
            action="Add a book"
            description="No current book is wired yet. Add one on Books to unlock the fast check-in flow."
            title="No current book"
          />
        )}

        <form className="soft-card grid gap-4 p-5" onSubmit={handleCheckIn}>
          <h2 className="text-xl font-black text-ink">Fast check-in</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Book
            <select
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setSelectedBookId(event.target.value)}
              value={selectedBookId}
            >
              <option value="">Choose a book</option>
              {state?.books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Unit
              <select
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                disabled={skipped}
                onChange={(event) => setUnit(event.target.value as CheckInUnit)}
                value={unit}
              >
                {units.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Amount
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                disabled={skipped}
                min="0"
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                value={amount}
              />
            </label>
          </div>
          <label className="flex items-center gap-3 rounded-app border border-[#dedbd2] bg-white p-3 text-sm font-bold text-slate-700">
            <input
              checked={skipped}
              onChange={(event) => setSkipped(event.target.checked)}
              type="checkbox"
            />
            Skipped today
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Visibility
            <select
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setVisibility(event.target.value as CheckInVisibility)}
              value={visibility}
            >
              <option value="private">Private</option>
              <option value="groups">Group-visible</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Optional note
            <textarea
              className="min-h-20 rounded-app border border-[#dedbd2] px-3 py-2"
              onChange={(event) => setNote(event.target.value)}
              placeholder="A quick thought, if you want."
              value={note}
            />
          </label>
          {message ? (
            <p className="rounded-app border border-[#dedbd2] bg-white p-3 text-sm text-slate-700">
              {message}
            </p>
          ) : null}
          <button className="primary-button" type="submit">
            Save check-in
          </button>
        </form>

        <section className="soft-card p-5">
          <h2 className="text-xl font-black text-ink">Recent check-ins</h2>
          <div className="mt-4 grid gap-3">
            {recentLogs.length ? (
              recentLogs.map((log) => {
                const book = state?.books.find((item) => item.id === log.userBookId);
                return (
                  <article className="rounded-app border border-[#dedbd2] bg-white p-4" key={log.id}>
                    <h3 className="font-black text-ink">{book?.title ?? "Unknown book"}</h3>
                    <p className="mt-1 text-sm text-slate-700">
                      {log.skipped ? "Skipped today" : `${log.amount} ${log.unit}`} ·{" "}
                      {log.visibility}
                    </p>
                    {log.note ? <p className="mt-2 text-sm text-slate-600">{log.note}</p> : null}
                  </article>
                );
              })
            ) : (
              <p className="rounded-app border border-[#dedbd2] bg-white p-4 text-slate-700">
                No check-ins yet.
              </p>
            )}
          </div>
        </section>

        <section className="soft-card p-5">
          <h2 className="text-xl font-black text-ink">Foundation state</h2>
          <dl className="mt-4 grid gap-3">
            <div className="flex justify-between rounded-app border border-[#dedbd2] bg-white px-4 py-3">
              <dt className="text-sm text-slate-600">Groups</dt>
              <dd className="text-sm font-black text-ink">{groupCount}</dd>
            </div>
            <div className="flex justify-between rounded-app border border-[#dedbd2] bg-white px-4 py-3">
              <dt className="text-sm text-slate-600">Current books</dt>
              <dd className="text-sm font-black text-ink">{state?.books.length ?? 0}</dd>
            </div>
            <div className="flex justify-between rounded-app border border-[#dedbd2] bg-white px-4 py-3">
              <dt className="text-sm text-slate-600">Reading logs</dt>
              <dd className="text-sm font-black text-ink">{state?.readingLogs.length ?? 0}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="secondary-button" href="/books">
              Manage books
            </Link>
            <Link className="secondary-button" href="/groups">
              Manage groups
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
