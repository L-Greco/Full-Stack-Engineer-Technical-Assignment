export default function NullAsset() {
  return (
    <section className="rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
      <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
        Asset detail
      </p>
      <h2 className="m-0 text-[clamp(1.7rem,2.5vw,2.4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-slate-900">
        Select an asset
      </h2>
      <p className="mt-3 text-base leading-7 text-slate-600">
        Click a marker on the map or choose an item from the list to inspect it here.
      </p>
    </section>
  );
}
