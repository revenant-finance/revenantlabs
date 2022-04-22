interface InfoBanner {
    header: string
    title: string
    subtitle: string
    children?: any
}

export default function InfoBanner({ header, title, subtitle, children }: InfoBanner) {
    return (
        <div className="p-6 bg-opacity-50 border-2 shadow-2xl bg-neutral-800 border-neutral-800 rounded-2xl">
            <div className="flex flex-col gap-6 md:flex-row">
                <div className="space-y-2">
                    <p className="text-xs font-bold tracking-widest uppercase opacity-50">
                        {header}
                    </p>
                    <p className="text-2xl font-medium text-yellow-400">{title}</p>
                    <p className="text-xl">{subtitle}</p>
                </div>
                {children}
            </div>
        </div>
    )
}
