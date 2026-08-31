import { Header } from "@/components/layout/Header";
import { VinylGrid } from "@/components/collection/VinylGrid";
import type { UserVinyl } from "@/types/vinyl";

const DEMO_VINYLS: UserVinyl[] = [];

export default function CollectionPage() {
  return (
    <div className="space-y-6 py-6">
      <Header title="Colección" subtitle={`${DEMO_VINYLS.length} vinilos`} />
      <VinylGrid vinyls={DEMO_VINYLS} />
    </div>
  );
}
