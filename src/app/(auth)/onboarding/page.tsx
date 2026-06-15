"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readMockState, saveMockProfile } from "@/lib/mock-app-state";

export default function OnboardingPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const state = readMockState();
    setDisplayName(state.profile?.displayName ?? "");
    setFavoriteGenres(state.profile?.favoriteGenres ?? "");
    setTimezone(state.profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!displayName.trim()) {
      setMessage("Display name is required.");
      return;
    }

    saveMockProfile({
      displayName: displayName.trim(),
      favoriteGenres: favoriteGenres.trim(),
      timezone
    });
    router.push("/today");
  }

  return (
    <main className="page-shell">
      <section className="content-wrap flex min-h-screen items-center justify-center py-10">
        <div className="soft-card w-full max-w-xl p-6">
          <p className="eyebrow">Profile setup mock</p>
          <h1 className="mt-3 text-3xl font-black text-ink">
            Set up your reading identity.
          </h1>
          <p className="mt-3 leading-7 text-slate-700">
            Sprint 1 will connect this flow to profiles. Optional fields should
            never block a new reader from reaching the app.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Display name
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your name"
                value={displayName}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Favorite genres
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setFavoriteGenres(event.target.value)}
                placeholder="Mystery, memoir, fantasy"
                value={favoriteGenres}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Timezone
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setTimezone(event.target.value)}
                value={timezone}
              />
            </label>
            {message ? (
              <p className="rounded-app border border-[#dedbd2] bg-white p-3 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
            <button className="primary-button" type="submit">
              Finish setup
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
