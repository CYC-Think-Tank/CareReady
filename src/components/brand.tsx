import { Activity } from "lucide-react";
import Link from "next/link";

type BrandProps = {
  compact?: boolean;
  light?: boolean;
};

export function Brand({ compact = false, light = false }: BrandProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-citrus focus-visible:ring-offset-4 ${
        light ? "focus-visible:ring-offset-ink" : "focus-visible:ring-offset-cream"
      }`}
      aria-label="CareReady Ontario home"
    >
      <span
        className={`grid size-10 place-items-center border-2 ${
          light
            ? "border-citrus bg-citrus text-ink"
            : "border-ink bg-ink text-citrus"
        }`}
        aria-hidden="true"
      >
        <Activity size={22} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block text-[1.05rem] font-extrabold tracking-[-0.035em] ${
              light ? "text-white" : "text-ink"
            }`}
          >
            CareReady
          </span>
          <span
            className={`mt-1 block text-[0.64rem] font-bold uppercase tracking-[0.18em] ${
              light ? "text-mint" : "text-teal"
            }`}
          >
            Ontario
          </span>
        </span>
      )}
    </Link>
  );
}

