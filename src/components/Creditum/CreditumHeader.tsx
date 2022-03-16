import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface HeaderLink {
    href: string
    icon: string
    children: any
    className?: string
}

const CredtiumHeaderLink = ({ href, icon, children, className }: HeaderLink) => {
    const router = useRouter()
    const isThisPage = router.asPath === href
    return (
        <div className="flex items-center">
            <Link href={href} passHref>
                <a
                    className={classNames(
                        'text-xs sm:text-base px-4 py-2 shadow-xl  border-2 border-neutral-800 rounded-2xl',
                        isThisPage
                            ? 'bg-yellow-400 text-neutral-800'
                            : 'bg-neutral-800 bg-opacity-50',
                        className
                    )}
                >
                    <i
                        className={classNames(
                            'text-xs mr-2',
                            isThisPage ? 'opacity-100' : 'opacity-25',
                            icon
                        )}
                    />
                    <span>{children}</span>
                </a>
            </Link>
        </div>
    )
}

export default function CredtiumHeader() {
    return (
        <div className="w-full p-6 pb-0 mx-auto space-y-2 max-w-7xl md:pt-12">
            <div className="flex flex-col gap-2 md:flex-row">
                <Link href="/creditum" passHref>
                    <a>
                        <img className="w-24 md:w-16" src="/img/creditum.png" alt="" />
                    </a>
                </Link>
                <div className="hidden md:block flex-1" />
                <div className="flex space-x-2 font-medium whitespace-nowrap no-scrollbar">
                    <CredtiumHeaderLink href="/creditum" icon="fa-solid fa-magnifying-glass-dollar">
                        Market
                    </CredtiumHeaderLink>
                    <CredtiumHeaderLink href="/creditum/farms" icon="fa-solid fa-tractor">
                        Farms
                    </CredtiumHeaderLink>
                    <CredtiumHeaderLink href="/creditum/locking" icon="fa-solid fa-vault">
                        Locking
                    </CredtiumHeaderLink>
                </div>
            </div>
        </div>
    )
}
