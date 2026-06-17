type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-7 flex max-w-3xl gap-4 sm:mb-8">
      <span className="book-mark mt-1 hidden sm:block" aria-hidden="true" />
      <div>
        <p className="eyebrow inline-flex rounded-app border border-[#ded5c6] bg-[#fffdf8]/84 px-3 py-1 shadow-sm">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-black leading-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-700">
          {description}
        </p>
      </div>
    </header>
  );
}
