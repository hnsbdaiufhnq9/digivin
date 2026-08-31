import { Header } from "@/components/layout/Header";
import { PackOpener } from "@/components/packs/PackOpener";

export default function PacksPage() {
  return (
    <div className="space-y-6 py-6">
      <Header
        title="Crate Dig"
        subtitle="Sobres sorpresa"
      />
      <PackOpener
        packName="Crate Dig Vol. 1"
        creditsCost={1}
      />
    </div>
  );
}
