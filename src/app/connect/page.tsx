import { Header } from "@/components/layout/Header";
import { StreamingConnect } from "@/components/auth/StreamingConnect";

export default function ConnectPage() {
  return (
    <div className="space-y-6 py-6">
      <Header
        title="Conectar"
        subtitle="Streaming y compras verificadas"
      />
      <StreamingConnect expanded />
    </div>
  );
}
