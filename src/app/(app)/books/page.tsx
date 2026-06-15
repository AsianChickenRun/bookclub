"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  addMockBook,
  MockAppState,
  ReadingFormat,
  ReadingGoalType,
  readMockState
} from "@/lib/mock-app-state";

const formats: ReadingFormat[] = ["print", "ebook", "audiobook", "mixed"];
const goalTypes: ReadingGoalType[] = ["pages", "chapters", "minutes", "sessions"];

export default function BooksPage() {
  const [state, setState] = useState<MockAppState | null>(null);
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
    setState(readMockState());
  }, []);

  function numericValue(value: string) {
    return value.trim() ? Number(value) : null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      addMockBook({
        title: title.trim(),
        author: author.trim(),
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
    setMessage("Book added locally for Sprint 2.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Books"
        title="Add the book you are already reading."
        description="Sprint 2 adds current book tracking with local persistence and Supabase-ready data shape."
      />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="soft-card grid gap-4 p-5" onSubmit={handleSubmit}>
          <h2 className="text-xl font-black text-ink">Current book</h2>
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
        <section className="soft-card p-5">
          <h2 className="text-xl font-black text-ink">Your current books</h2>
          <div className="mt-4 grid gap-3">
            {state?.books.length ? (
              state.books.map((book) => (
                <article className="rounded-app border border-[#dedbd2] bg-white p-4" key={book.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-ink">{book.title}</h3>
                      <p className="mt-1 text-sm text-slate-700">
                        {book.author || "Unknown author"} · {book.format} · {book.goalType}
                      </p>
                    </div>
                    <span className="rounded-app bg-skysoft px-3 py-1 text-xs font-black text-moss">
                      {book.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Page {book.currentPage ?? "?"}
                    {book.totalPages ? ` of ${book.totalPages}` : ""} · Chapter{" "}
                    {book.currentChapter ?? "?"}
                    {book.totalChapters ? ` of ${book.totalChapters}` : ""}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-app border border-[#dedbd2] bg-white p-4 text-slate-700">
                No current books yet. Add one to unlock the check-in flow on Today.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
