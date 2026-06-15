type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-black leading-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
        {description}
      </p>
    </header>
  );
}
