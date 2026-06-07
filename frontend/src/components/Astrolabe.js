export default function Astrolabe() {
  return (
    <header className="flex items-center gap-6 px-6 py-3 bg-panel border-b border-border">
      <h1 className="text-title tracking-[2px] uppercase text-gold select-none">
        AncesTree
      </h1>

      <div className="flex-1 flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter repository URL..."
          className="flex-1 max-w-md px-3 py-1.5 text-sm text-body bg-canvas border border-border rounded outline-none placeholder:text-muted focus:border-gold transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input type="checkbox" className="accent-gold" />
          Token
        </label>

        <button className="px-4 py-1.5 text-sm font-medium text-canvas bg-gold rounded hover:brightness-110 transition-all">
          Refresh &amp; Sync Tree
        </button>
      </div>
    </header>
  );
}
