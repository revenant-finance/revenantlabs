import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function SingularityHeaderItem({ href, children }) {
    const router = useRouter()
    const isActive = router.asPath.split('?')[0] === href

    return (
        <Link href={href} passHref>
            <a
                className={classNames(
                    'font-medium',
                    isActive &&
                        'bg-gradient-to-br from-purple-500 to-blue-500 text-transparent bg-clip-text'
                )}
            >
                {children}
            </a>
        </Link>
    )
}

export default function SingularityHeader() {
    return (
        <div className="flex justify-center items-center p-12">
            <div className="relative z-10 px-6 py-3 border-2 shadow-2xl bg-opacity-75 bg-neutral-900 border-neutral-800 rounded-3xl flex gap-4">
                <SingularityHeaderItem href="/singularity">Swap</SingularityHeaderItem>
                <SingularityHeaderItem href="/singularity/liquidity">
                    Liquidity
                </SingularityHeaderItem>
            </div>
        </div>
    )
}
