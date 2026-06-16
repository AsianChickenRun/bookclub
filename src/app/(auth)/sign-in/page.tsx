"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getRepository } from "@/lib/persistence/repository";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("reader@example.com");
  const [password, setPassword] = useState("reading");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Email and password are required.");
      return;
    }

    const state = await getRepository().signIn(email.trim());
    router.push(state.profile ? "/today" : "/onboarding");
  }

  return (
    <main className="page-shell">
      <section className="content-wrap flex min-h-screen items-center justify-center py-10">
        <div className="soft-card w-full max-w-md p-6">
          <p className="eyebrow">Sign in</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Welcome back</h1>
          <p className="mt-3 leading-7 text-slate-700">
            Use any email and password to enter this local-first preview.
            Your reading data stays in this browser until cloud accounts are connected.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Email
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="reader@example.com"
                type="email"
                value={email}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Password
              <input
                className="min-h-11 rounded-app border border-[#dedbd2] px-3"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                value={password}
              />
            </label>
            {message ? (
              <p className="rounded-app border border-[#dedbd2] bg-white p-3 text-sm text-slate-700">
                {message}
              </p>
            ) : null}
            <button className="primary-button" type="submit">
              Continue
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
