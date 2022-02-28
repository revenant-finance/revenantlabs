export default function InfoBanner({ header, title, subtitle }) {
    return (
        <div className="border-4 border-neutral-900 border-opacity-50 p-6 space-y-2">
            <p className="text-xs font-bold opacity-50 uppercase tracking-widest">{header}</p>
            <p className="text-2xl text-yellow-400">{title}</p>
            <p className="text-xl opacity-75">{subtitle}</p>
        </div>
    )
}
