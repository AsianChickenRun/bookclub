import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="Reviews are planned, not active yet."
        description="Final reviews and live review timelines are important product systems, but they depend on book tracking and spoiler rules."
      />
      <PlaceholderCard
        description="This placeholder keeps the app architecture ready while review implementation stays out of Sprint 1."
        title="Review system deferred"
      />
    </>
  );
}
