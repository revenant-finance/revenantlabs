import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { formatter } from '../../utils'

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
                <i className={classNames('opacity-75 text-xs', icon)} />
                <span>{children}</span>
            </a>
        </Link>
    )
}

export function CreditumAppWrapper({ children }) {
    return (
        <>
            <div className="w-full max-w-7xl mx-auto p-6 md:pt-12 pb-0 space-y-6">
                <div className="flex flex-wrap items-center overflow-auto whitespace-nowrap gap-6">
                    <div className="w-full md:w-auto">
                        <img className="w-24 md:w-16" src="/img/creditum.png" alt="" />
                    </div>
                    <div className="opacity-50">
                        <p className="text-xs md:text-sm font-medium">Total Value Locked (TVL)</p>
                        <p className="md:text-2xl">${formatter(69696969)}</p>
                    </div>
                    <div className="opacity-50">
                        <p className="text-xs md:text-sm font-medium">Credit Price</p>
                        <p className="md:text-2xl">$3.06</p>
                        {/* <p className="text-xs">xCREDIT Price: $3.23</p> */}
                    </div>
                    <div className="opacity-50">
                        <p className="text-xs md:text-sm font-medium">Marketcap</p>
                        <p className="md:text-2xl">${formatter(420000000)}</p>
                        {/* <p className="text-xs">xCREDIT Price: $3.23</p> */}
                    </div>
                </div>

                <div className="space-x-6 font-medium flex whitespace-nowrap no-scrollbar overflow-auto">
                    <HeaderLink href="/" icon="fas fa-home" className="opacity-50">
                        Revenant
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

            {children}
        </>
    )
}
