"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getRepository } from "@/lib/persistence/repository";
import { getPersistenceStatus } from "@/lib/supabase/env";

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [message, setMessage] = useState("");
  const [backupText, setBackupText] = useState("");
  const [restoreText, setRestoreText] = useState("");
  const persistenceStatus = getPersistenceStatus();

  useEffect(() => {
    getRepository().getState().then((state) => {
      setDisplayName(state.profile?.displayName ?? "");
      setFavoriteGenres(state.profile?.favoriteGenres ?? "");
      setTimezone(state.profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
    });
  }, []);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!displayName.trim()) {
      setMessage("Display name is required.");
      return;
    }

    await getRepository().saveProfile({
      displayName: displayName.trim(),
      favoriteGenres: favoriteGenres.trim(),
      timezone
    });
    setMessage("Profile saved in this browser.");
  }

  async function handleSignOut() {
    await getRepository().clearSession();
    router.push("/sign-in");
  }

  async function handleExport() {
    setBackupText(await getRepository().exportState());
    setMessage("Backup created. Keep it somewhere safe if you want to move browsers.");
  }

  async function handleRestore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!restoreText.trim()) {
      setMessage("Paste a backup before restoring.");
      return;
    }

    try {
      const nextState = await getRepository().importState(restoreText);
      setDisplayName(nextState.profile?.displayName ?? "");
      setFavoriteGenres(nextState.profile?.favoriteGenres ?? "");
      setTimezone(nextState.profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
      setRestoreText("");
      setMessage("Backup restored in this browser.");
    } catch {
      setMessage("That backup could not be read. Check that you pasted the full JSON backup.");
    }
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
          <div className="mt-5 rounded-app border border-[#dedbd2] bg-white p-4">
            <p className="text-sm font-black text-ink">Persistence mode</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {persistenceStatus.mode === "local"
                ? "Browser-local preview is active."
                : "Supabase configuration is present, but the live repository is still pending."}
            </p>
            {persistenceStatus.missing.length ? (
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Cloud mode needs: {persistenceStatus.missing.join(", ")}.
              </p>
            ) : null}
          </div>
          <button className="secondary-button mt-5" onClick={handleSignOut} type="button">
            Clear local session
          </button>
        </section>
        <section className="soft-card grid gap-4 p-5 lg:col-span-2">
          <div>
            <p className="eyebrow">Local backup</p>
            <h2 className="mt-3 text-xl font-black text-ink">Move or protect this preview data</h2>
            <p className="mt-2 leading-7 text-slate-700">
              Until cloud accounts are connected, you can copy a local backup and restore it in
              another browser.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid gap-3">
              <button className="secondary-button justify-self-start" onClick={handleExport} type="button">
                Create backup
              </button>
              <textarea
                className="min-h-44 rounded-app border border-[#dedbd2] px-3 py-2 text-xs"
                onChange={(event) => setBackupText(event.target.value)}
                placeholder="Your backup will appear here."
                value={backupText}
              />
            </div>
            <form className="grid gap-3" onSubmit={handleRestore}>
              <textarea
                className="min-h-44 rounded-app border border-[#dedbd2] px-3 py-2 text-xs"
                onChange={(event) => setRestoreText(event.target.value)}
                placeholder="Paste a backup here to restore."
                value={restoreText}
              />
              <button className="primary-button justify-self-start" type="submit">
                Restore backup
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
