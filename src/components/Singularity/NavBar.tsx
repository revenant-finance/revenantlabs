import Link from 'next/link'

export default function () {
    return (
        <div className="p-6 flex items-center">
            <div className="flex-1">
                <Link href="/" passHref>
                    <a>
                        <i className="fas fa-home" />
                    </a>
                </Link>
            </div>
            {/* <div className="space-x-2">
                <ConnectWalletButton />
                <button type="button" className="px-4 py-2 rounded-3xl border-2 border-neutral-500 shadow text-neutral-500 bg-neutral-800 font-bold">
                    <i className="fas fa-dot-circle" />
                </button>
            </div> */}
        </div>
    )
}
