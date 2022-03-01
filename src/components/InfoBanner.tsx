interface InfoBanner {
    header: string
    title: string
    subtitle: string
    children?: any
}

export default function InfoBanner({ header, title, subtitle, children }: InfoBanner) {
    return (
        <div className="p-6 shadow-2xl bg-neutral-800 bg-opacity-50 border-2 border-neutral-800 rounded-2xl">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-2">
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">
                        {header}
                    </p>
                    <p className="font-medium text-2xl text-yellow-400">{title}</p>
                    <p className="text-xl">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    )
}
