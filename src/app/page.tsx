import Link from "next/link";

const previewStats = [
  { label: "Current sprint", value: "Sprint 1" },
  { label: "Scope", value: "Infrastructure" },
  { label: "Product systems", value: "Deferred" }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="content-wrap grid min-h-screen items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">Reading Momentum</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">
            Keep reading with friends, without making everyone read the same book.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            A calm app foundation for private groups, quick check-ins, and
            supportive accountability. Sprint 1 is building the shell before
            deeper product systems turn on.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="primary-button" href="/today">
              View app shell
            </Link>
            <Link className="secondary-button" href="/sign-in">
              Sign in mock
            </Link>
          </div>
        </div>

        <div className="soft-card p-5">
          <div className="rounded-app border border-[#dedbd2] bg-paper p-5">
            <p className="eyebrow">Build status</p>
            <div className="mt-5 grid gap-3">
              {previewStats.map((item) => (
                <div
                  className="flex items-center justify-between rounded-app border border-[#dedbd2] bg-white px-4 py-3"
                  key={item.label}
                >
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <strong className="text-sm text-ink">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
