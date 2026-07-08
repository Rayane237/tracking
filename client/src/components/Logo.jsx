export default function Logo({ className = 'h-12 w-auto', showText = true }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo-dubai-global-express.png"
        alt="Dubai Global Express"
        className={className}
      />
      {showText && (
        <div className="leading-tight">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand-dark">
            Dubai Global
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
            Express
          </p>
        </div>
      )}
    </div>
  );
}

