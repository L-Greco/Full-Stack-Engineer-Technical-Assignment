export default function ZeroAssets() {
  return (
      <section className="mt-5 rounded-3xl border border-slate-900/8 bg-white/92 p-5 text-center mainShadow">
        <h2 className="m-0 text-[clamp(2rem,3vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-900">
          No assets match these filters
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Try broadening the current selection to see more results.
        </p>
      </section>
  );
}