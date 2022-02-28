export default function InfoBanner({ header, title, subtitle }) {
    return (
        <div className="p-6 space-y-2 shadow-2xl bg-neutral-800 bg-opacity-50 border-2 border-neutral-800 rounded-2xl">
            <p className="text-xs font-bold opacity-50 uppercase tracking-widest">{header}</p>
            <p className="text-2xl text-yellow-400">{title}</p>
            <p className="text-xl opacity-75">{subtitle}</p>
        </div>
    )
}
