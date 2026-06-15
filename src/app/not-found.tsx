import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <section className="content-wrap flex min-h-screen items-center justify-center">
        <div className="soft-card max-w-md p-6 text-center">
          <p className="eyebrow">Not found</p>
          <h1 className="mt-3 text-3xl font-black text-ink">
            This page is not on the shelf.
          </h1>
          <p className="mt-3 leading-7 text-slate-700">
            Return to the app shell and keep the foundation moving.
          </p>
          <Link className="primary-button mt-6" href="/today">
            Go to Today
          </Link>
        </div>
      </section>
    </main>
  );
}
