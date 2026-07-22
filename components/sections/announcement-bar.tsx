import { Container } from "@/components/layout/container";
import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-surface-900 py-2.5 text-center text-sm text-white">
      <Container size="sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-400" />
          <span>
            New: Base network now supported. Pay with ETH on Base.
          </span>
        </div>
      </Container>
    </div>
  );
}
