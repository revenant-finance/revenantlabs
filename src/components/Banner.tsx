export default function Banner() {
    return (
        <div className="bg-yellow-500 bg-opacity-90 text-neutral-900">
            <div className="max-w-7xl mx-auto p-2">
                <p className="text-xs font-medium md:text-center whitespace-nowrap overflow-auto no-scrollbar">
                    Tools found on here are not without risk.{' '}
                    <a href="#" className="underline hover:no-underline">
                        Read more &rarr;
                    </a>
                </p>
            </div>
        </div>
    )
}
