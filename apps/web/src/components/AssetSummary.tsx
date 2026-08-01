interface ComponentProps {
  assetCount: number;
  isLoading: boolean;
  total: number;
}

export function AssetSummary({
  assetCount,
  isLoading,
  total
}: ComponentProps) {
  return (
    <section aria-live="polite" className="mt-5 flex flex-col gap-4 md:flex-row">
      <article className="flex-1 rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
        <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
          Visible now
        </p>
        <strong className="mt-2 block text-[2.2rem] leading-none font-semibold text-slate-900">
          {isLoading ? "…" : assetCount}
        </strong>
        <span className="mt-1.5 block text-[0.92rem] text-slate-600">
          assets in the current page
        </span>
      </article>

      <article className="flex-1 rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
        <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
          Total matches
        </p>
        <strong className="mt-2 block text-[2.2rem] leading-none font-semibold text-slate-900">
          {isLoading ? "…" : total}
        </strong>
        <span className="mt-1.5 block text-[0.92rem] text-slate-600">
          records returned by the active filters
        </span>
      </article>
    </section>
  );
}
