import { createRoute } from "@tanstack/react-router";
import { WhenTimeIsWidget } from "@/components/when-time-is/WhenTimeIsWidget";
import { TimeCompareSection } from "@/components/time-compare/TimeCompareSection";
import { WorldClockSection } from "@/components/world-clock/WorldClockSection";
import { rootRoute } from "@/routes/__root";

function HomePage() {
  return (
    <div className="space-y-5">
      <WhenTimeIsWidget />
      <WorldClockSection />
      <TimeCompareSection />
    </div>
  );
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
