import classNames from 'classnames'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface HeaderLink {
    href: string
    icon: string
    children: any
    className?: string
}

const HeaderLink = ({ href, icon, children, className }: HeaderLink) => {
    const router = useRouter()
    const isThisPage = router.asPath === href
    return (
        <div className="flex items-center">
            <Link href={href} passHref>
                <a className={classNames('flex items-center space-x-2', isThisPage && 'bg-yellow-400 text-neutral-900 px-4 py-2', className)}>
                    <i className={classNames('text-xs', isThisPage ? 'opacity-100' : 'opacity-25', icon)} />
                    <span>{children}</span>
                </a>
            </Link>
        </div>
    )
}

export function CreditumAppWrapper({ children }) {
    return (
        <>
            <Head>
                <title>Creditum — Revenant Labs</title>
            </Head>

            <div className="fixed inset-0 bg-gradient-to-tl from-yellow-500 to-neutral-500 opacity-20" />

            <div className="relative z-10 text-yellow-100">
                <div className="w-full p-6 pb-0 mx-auto space-y-6 max-w-7xl md:pt-12">
                    {/* <div className="flex flex-wrap items-center gap-6 overflow-auto whitespace-nowrap">
                        <div className="w-full md:w-auto">
                            <Link href="/creditum" passHref>
                                <a>
                                    <img className="w-24 md:w-20" src="/img/creditum.png" alt="" />
                                </a>
                            </Link>
                        </div>
                        <div className="opacity-50">
                            <p className="text-xs font-medium md:text-sm">Total Value Locked (TVL)</p>
                            <p className="md:text-2xl">${formatter(69696969)}</p>
                        </div>
                        <div className="opacity-50">
                            <p className="text-xs font-medium md:text-sm">Credit Price</p>
                            <p className="md:text-2xl">$3.06</p>
                        </div>
                        <div className="opacity-50">
                            <p className="text-xs font-medium md:text-sm">Marketcap</p>
                            <p className="md:text-2xl">${formatter(420000000)}</p>
                        </div>
                    </div> */}
                    <div className="flex flex-col gap-4 md:flex-row">
                        <Link href="/creditum" passHref>
                            <a>
                                <img className="w-16" src="/img/creditum.png" alt="" />
                            </a>
                        </Link>
                        <div className="flex-1" />
                        <div className="flex space-x-6 overflow-auto font-medium whitespace-nowrap no-scrollbar">
                            {/* <HeaderLink href="/" icon="fas fa-home" className="opacity-50">
                                Home
                            </HeaderLink> */}
                            <HeaderLink href="/creditum" icon="fa-solid fa-magnifying-glass-dollar">
                                Market
                            </HeaderLink>
                            <HeaderLink href="/creditum/farms" icon="fa-solid fa-tractor">
                                Farms
                            </HeaderLink>
                            <HeaderLink href="/creditum/locking" icon="fa-solid fa-vault">
                                Locking
                            </HeaderLink>
                        </div>
                    </div>
                </div>
                {children}
                <div className="w-full p-6 py-24 mx-auto space-y-12 max-w-7xl">
                    <div className="w-full max-w-sm mx-auto space-y-1">
                        <p className="font-medium">Creditum</p>
                        <p className="text-2xl opacity-50">Creditum enables its users to mint cUSD — a safe and powerful stablecoin — by depositing a variety of assets that earn yield passively, and farm rewards against them.</p>
                    </div>
                    <div className="text-xs font-medium text-center uppercase">Revenant Labs — Creditum &copy; {new Date().getFullYear()} </div>
                </div>
                <div className="flex">
                    <div className="flex-1 h-2 bg-purp" />
                    <div className="flex-1 h-2 bg-salmon" />
                    <div className="flex-1 h-2 bg-bluey" />
                    <div className="flex-1 h-2 bg-greeny" />
                    <div className="flex-1 h-2 bg-purp" />
                    <div className="flex-1 h-2 bg-salmon" />
                    <div className="flex-1 h-2 bg-bluey" />
                    <div className="flex-1 h-2 bg-greeny" />
                </div>
            </div>
        </>
    )
}
