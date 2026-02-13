import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/types";

const ORDER: Theme[] = ["system", "light", "dark"];

function getIcon(theme: Theme, resolvedTheme: "light" | "dark") {
  if (theme === "system") return Laptop;
  return resolvedTheme === "dark" ? Moon : Sun;
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const nextTheme = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const Icon = getIcon(theme, resolvedTheme);

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 border-white/40 bg-white/70 backdrop-blur-sm hover:bg-white dark:border-white/15 dark:bg-slate-900/70 dark:hover:bg-slate-900"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch theme, current theme ${theme}`}
      title={`Theme: ${theme} (tap to switch)`}
    >
      <Icon className="h-4 w-4" />
      <span className="capitalize">{theme}</span>
    </Button>
  );
}
