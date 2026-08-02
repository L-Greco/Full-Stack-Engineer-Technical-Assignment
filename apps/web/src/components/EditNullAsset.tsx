export default function EditNullAsset({ onCancel }: { onCancel: () => void }) {
  return (
    <section className="rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
      <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
        Asset form
      </p>
      <h2 className="m-0 text-[clamp(1.7rem,2.5vw,2.4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-slate-900">
        Select an asset to edit
      </h2>
      <button
        className="mt-5 cursor-pointer rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        onClick={onCancel}
        type="button"
      >
        Back to details
      </button>
    </section>
  );
}
