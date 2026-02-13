import { Globe2 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/35 bg-white/70 backdrop-blur-lg dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-xl bg-primary/12 p-2 text-primary dark:bg-primary/20">
            <Globe2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold md:text-xl">{APP_NAME}</h1>
            <p className="truncate text-xs text-muted-foreground md:text-sm">
              World clocks and live timezone comparisons
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
