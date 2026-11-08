// Top bar used on the Manual and Results pages
export default function Header({ onBack, children }) {
    return (
        <header className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 bg-sage">
            <button type="button" className="btn-secondary" onClick={onBack}>
                ← Back
            </button>
            <span className="font-concert text-2xl text-forest">Check-Mate</span>
            {/* Right side: page-specific button, or a spacer to keep the title centered */}
            <div className="min-w-[78px] flex justify-end">{children}</div>
        </header>
    )
}
