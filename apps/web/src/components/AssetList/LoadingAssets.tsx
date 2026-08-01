export default function LoadingAssets() {
  return (
      <section
        aria-busy="true"
        className="mt-5 rounded-3xl border border-slate-900/8 bg-white/92 p-5 text-center mainShadow"
      >
        <div className="text-base leading-7 text-slate-600">Loading assets…</div>
      </section>
  );
}