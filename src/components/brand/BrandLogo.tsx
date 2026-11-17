import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Rendered height of the emblem in pixels. */
  size?: number;
  /** Show the "BARBER SYSTEM" wordmark next to the emblem. */
  withWordmark?: boolean;
  /** Stack the wordmark under the emblem instead of beside it. */
  stacked?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * Brand mark: the chrome "JS" shield plus the wordmark.
 * The emblem ships with a real alpha channel, so it sits on any surface.
 */
export function BrandLogo({
  size = 40,
  withWordmark = true,
  stacked = false,
  priority = false,
  className,
}: BrandLogoProps) {
  const emblem = (
    <Image
      src="/brand/logo-chrome-js-256.png"
      alt="Barber System"
      width={size}
      height={size}
      priority={priority}
      className="shrink-0 object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]"
      style={{ height: size, width: size }}
    />
  );

  if (!withWordmark) {
    return <span className={cn("inline-flex", className)}>{emblem}</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5",
        stacked ? "flex-col gap-2 text-center" : "flex-row",
        className,
      )}
    >
      {emblem}
      <span className="flex flex-col leading-none">
        <span className="chrome-text text-sm font-bold tracking-[0.22em] uppercase">
          Barber
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-[0.34em] text-steel/80 uppercase">
          System
        </span>
      </span>
    </span>
  );
}
