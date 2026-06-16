import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="Reviews are coming next."
        description="Final reviews and live reflections will connect to your books, progress, and spoiler preferences."
      />
      <PlaceholderCard
        description="For now, keep checking in and building your reading history. Reviews will become more useful once books and groups are connected to cloud accounts."
        title="Review tools are not active yet"
      />
    </>
  );
}
