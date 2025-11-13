function Row({ label, value, trailing }) {
  return (
    <div
      className={
        "flex items-center justify-between py-2 border-b " +
        "border-white/15 last:border-0"
      }
    >
      <span className="text-white/80 truncate pr-4">{label}</span>
      <div className="flex items-center gap-2">
        {trailing}
        <span className="font-semibold text-white tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}

export default Row;