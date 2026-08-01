interface ComponentProps {
  errorMessage: string;
  onRetry: () => void;
}

export default function ErrorMessage({ errorMessage, onRetry }: ComponentProps) {
  return (
          <section
            aria-live="polite"
            className="mt-5 rounded-3xl border border-slate-900/8 bg-white/92 px-5 py-6 text-center mainShadow"
          >
            <h2 className="m-0 text-[clamp(2rem,3vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-900">
              We could not load assets
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
              {errorMessage}
            </p>
            <button
              className="mt-4 cursor-pointer rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              onClick={onRetry}
              type="button"
            >
              Retry
            </button>
          </section>
  );
}