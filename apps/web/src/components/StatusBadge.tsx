import type { AssetStatus } from "../types/assets";

interface ComponentProps {
  status: AssetStatus;
}

const STATUS_STYLES: Record<AssetStatus, string> = {
  ok: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  critical: "bg-rose-100 text-rose-800"
};

export function StatusBadge({ status }: ComponentProps) {
  return (
    <span
      className={`inline-flex min-w-23 items-center justify-center rounded-full px-3 py-2 text-[0.82rem] font-bold uppercase ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
