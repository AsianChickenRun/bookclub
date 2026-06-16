type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-7 max-w-3xl sm:mb-8">
      <p className="eyebrow inline-flex rounded-app border border-[#ddd5c7] bg-[#fffdf8]/78 px-3 py-1 shadow-sm">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-black leading-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-base leading-7 text-slate-700">
        {description}
      </p>
    </header>
  );
}
