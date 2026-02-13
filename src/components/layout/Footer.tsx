export function Footer() {
  return (
    <footer className="border-t border-white/35 bg-white/65 py-4 text-sm text-muted-foreground backdrop-blur-lg dark:border-white/10 dark:bg-slate-950/65">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <p>Built for distributed teams and global planning.</p>
        <a
          href="https://github.com/dev-lin2/when-is-time"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
