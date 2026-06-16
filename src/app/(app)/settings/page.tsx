"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  clearMockState,
  readMockState,
  saveMockProfile
} from "@/lib/mock-app-state";

export default function SettingsPage() {
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

  function handleSave(event: FormEvent<HTMLFormElement>) {
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
    setMessage("Profile saved in this browser.");
  }

  function handleSignOut() {
    clearMockState();
    router.push("/sign-in");
  }

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Account and preference controls."
        description="Update your reading profile, review this browser-based preview mode, or reset the local session."
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="soft-card grid gap-4 p-5" onSubmit={handleSave}>
          <h2 className="text-xl font-black text-ink">Profile</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Display name
            <input
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setDisplayName(event.target.value)}
              value={displayName}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Favorite genres
            <input
              className="min-h-11 rounded-app border border-[#dedbd2] px-3"
              onChange={(event) => setFavoriteGenres(event.target.value)}
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
            Save profile
          </button>
        </form>
        <section className="soft-card p-5">
          <h2 className="text-xl font-black text-ink">Preview controls</h2>
          <p className="mt-2 leading-7 text-slate-700">
            This deployed preview saves data in your current browser. Cloud sync,
            shared accounts, and notifications will come after the database is connected.
          </p>
          <button className="secondary-button mt-5" onClick={handleSignOut} type="button">
            Clear local session
          </button>
        </section>
      </div>
    </>
  );
}
