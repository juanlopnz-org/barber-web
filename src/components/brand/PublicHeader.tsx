import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";

/**
 * Compact brand bar used by the public (guest) pages so the emblem and the
 * wordmark are always visible outside the authenticated shell.
 */
export function PublicHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-6 lg:px-8">
      <Link href="/" className="min-w-0" aria-label="Barber System">
        <BrandLogo size={42} priority />
      </Link>
      <nav className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/guest/booking">Reservar</Link>
        </Button>
      </nav>
    </header>
  );
}
