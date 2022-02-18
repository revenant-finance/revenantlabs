export default function Banner() {
    return (
        <div>
            <a href="https://documentation.revenant.finance/creditum" target="_blank" className="block bg-yellow-400 text-neutral-900 group">
                <div className="max-w-7xl mx-auto p-2">
                    <p className="text-xs font-medium md:text-center whitespace-nowrap overflow-auto no-scrollbar">
                        Tools found on here are not without risk.{' '}
                        <a href="#" className="underline group-hover:no-underline">
                            Read more &rarr;
                        </a>
                    </p>
                </div>
            </a>
        </div>
    )
}
