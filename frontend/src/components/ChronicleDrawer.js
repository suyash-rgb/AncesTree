export default function ChronicleDrawer({ isOpen, commitData, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => onClose && onClose()}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-panel border-l border-border z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-section">Chronicle</h2>
            <span className="text-xs text-muted">commit details</span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {commitData ? (
              <>
                <section>
                  <h3 className="text-panel mb-2">Commit</h3>
                  <p className="text-data text-gold">{commitData.hash}</p>
                  <p className="text-sm text-body mt-1">{commitData.message}</p>
                </section>

                <section>
                  <h3 className="text-panel mb-2">Author</h3>
                  <p className="text-sm text-body">{commitData.author}</p>
                  <p className="text-xs text-muted">{commitData.date}</p>
                </section>

                <section>
                  <h3 className="text-panel mb-2">References</h3>
                  <p className="text-sm text-muted">—</p>
                </section>
              </>
            ) : (
              <p className="text-sm text-muted text-center mt-12">
                Click a commit node to view details
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
