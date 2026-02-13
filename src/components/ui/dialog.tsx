import {
  createContext,
  useContext,
  useEffect,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

interface DialogProps extends PropsWithChildren {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  if (!open) return null;

  return createPortal(
    <DialogContext.Provider value={{ onOpenChange }}>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onOpenChange(false);
          }
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full max-w-xl">{children}</div>
      </div>
    </DialogContext.Provider>,
    document.body,
  );
}

export function DialogContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "relative w-full max-w-xl rounded-2xl border border-white/35 bg-white/95 p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-950/95",
        className,
      )}
      {...props}
    />
  );
}

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3 space-y-1", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-display text-xl font-semibold", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function DialogCloseButton({ className, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const context = useContext(DialogContext);

  return (
    <button
      type="button"
      className={cn(
        "absolute right-4 top-4 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      onClick={() => context?.onOpenChange(false)}
      {...props}
    />
  );
}
