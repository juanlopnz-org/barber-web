"use client";

import {
  useEffect,
  useId,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  /** Controlled visibility. The native `<dialog>` is opened in modal mode. */
  open: boolean;
  /** Called when the modal is dismissed (X button, Esc, backdrop, footer). */
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  /** Sticky footer with the action buttons. */
  footer?: ReactNode;
  /** When provided, the body is wrapped in a `<form method="dialog">`. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
}

/**
 * Shared modal used across the app.
 *
 * Why the explicit positioning classes instead of relying on the UA
 * stylesheet: Tailwind's preflight resets `margin: 0` on every element,
 * which destroys the `margin: auto` that `<dialog>` uses to center itself.
 * The dialog is therefore positioned with `top/left: 50%` + a translate
 * transform, which is deterministic on both mobile and desktop.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  onSubmit,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Open/close the native dialog in sync with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // The `close` event covers every native dismissal path (Esc key, the
  // `close()` call above) and keeps React state in sync with the DOM.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onCloseRef.current();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Clicking the backdrop (the dialog element itself) dismisses the modal.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        "fixed bottom-auto left-1/2 right-auto top-1/2 z-50 m-0 flex h-auto w-[calc(100vw_-_2rem)] max-w-lg max-h-[calc(100dvh_-_2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#131922] p-0 text-foreground shadow-2xl backdrop:bg-black/60",
        className,
      )}
    >
      <form
        method="dialog"
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="flex items-start gap-3">
            {icon ? <span className="mt-0.5 text-primary">{icon}</span> : null}
            <div className="space-y-1">
              <h2
                id={titleId}
                className="text-lg font-semibold leading-tight text-foreground"
              >
                {title}
              </h2>
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <footer className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        ) : null}
      </form>
    </dialog>
  );
}

/**
 * Labelled form control with an optional error message.
 *
 * The control is wrapped by the `<label>`, so clicking the text focuses the
 * control and screen readers announce the correct name without needing ids.
 */
export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? (
        <span className="block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
