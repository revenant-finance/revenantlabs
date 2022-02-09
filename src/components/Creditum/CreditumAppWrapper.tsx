import classNames from 'classnames'
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
        <Link href={href} passHref>
            <a className={classNames('flex items-center space-x-2', isThisPage && 'text-yellow-400', className)}>
                <i className={classNames('opacity-50 text-xs', icon)} />
                <span>{children}</span>
            </a>
        </Link>
    )
}

export function CreditumAppWrapper({ children }) {
    return (
        <>
            <div className="w-full max-w-7xl mx-auto p-6 md:pt-12 pb-0 space-y-6">
                {/* <div className="flex flex-wrap items-center overflow-auto whitespace-nowrap gap-6">
                    <div className="w-full md:w-auto">
                        <Link href="/creditum" passHref>
                            <a>
                                <img className="w-24 md:w-20" src="/img/creditum.png" alt="" />
                            </a>
                        </Link>
                    </div>
                    <div className="opacity-50">
                        <p className="text-xs md:text-sm font-medium">Total Value Locked (TVL)</p>
                        <p className="md:text-2xl">${formatter(69696969)}</p>
                    </div>
                    <div className="opacity-50">
                        <p className="text-xs md:text-sm font-medium">Credit Price</p>
                        <p className="md:text-2xl">$3.06</p>
                    </div>
                    <div className="opacity-50">
                        <p className="text-xs md:text-sm font-medium">Marketcap</p>
                        <p className="md:text-2xl">${formatter(420000000)}</p>
                    </div>
                </div> */}

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-auto">
                        <Link href="/creditum" passHref>
                            <a>
                                <img className="w-16" src="/img/creditum.png" alt="" />
                            </a>
                        </Link>
                    </div>
                    <div className="space-x-6 font-medium flex whitespace-nowrap no-scrollbar overflow-auto">
                        <HeaderLink href="/" icon="fas fa-home" className="opacity-50">
                            Home
                        </HeaderLink>
                        <HeaderLink href="/creditum" icon="fa-solid fa-magnifying-glass-dollar">
                            Market
                        </HeaderLink>
                        <HeaderLink href="/creditum/farms" icon="fa-solid fa-tractor">
                            Farms
                        </HeaderLink>
                        <HeaderLink href="/creditum/staking" icon="fa-solid fa-vault">
                            Staking
                        </HeaderLink>
                    </div>
                </div>
            </div>

            {children}

            <div className="w-full max-w-7xl mx-auto p-6 pb-24 pt-0 space-y-12">
                <div className="max-w-sm w-full mx-auto space-y-1">
                    <p className="font-medium">Creditum</p>
                    <p className="text-2xl opacity-50">Creditum enables its users to mint cUSD — a safe and powerful stablecoin — by depositing a variety of assets that earn yield passively, and farm rewards against them.</p>
                </div>

                <div className="text-center uppercase text-xs font-medium">Revenant Labs — Creditum &copy; {new Date().getFullYear()} </div>
            </div>
        </>
    )
}
