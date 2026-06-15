type PlaceholderCardProps = {
  title: string;
  description: string;
  action?: string;
};

export function PlaceholderCard({
  title,
  description,
  action
}: PlaceholderCardProps) {
  return (
    <section className="soft-card p-5">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-2 leading-7 text-slate-700">{description}</p>
      {action ? (
        <button className="secondary-button mt-5" type="button">
          {action}
        </button>
      ) : null}
    </section>
  );
}
