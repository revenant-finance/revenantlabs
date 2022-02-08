import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

const HeaderLink = ({ href, icon, children }) => {
    const router = useRouter()
    const isThisPage = router.asPath === href
    return (
        <Link href={href} passHref>
            <a className={classNames('space-x-2', isThisPage && 'text-yellow-400')}>
                <i className={classNames('opacity-75', icon)} />
                <span>{children}</span>
            </a>
        </Link>
    )
}

export function CreditumAppWrapper({ children }) {
    return (
        <>
            <div className="w-full max-w-7xl mx-auto p-6 md:py-12 pb-0 space-y-6">
                <div className="flex flex-wrap items-center overflow-auto whitespace-nowrap gap-6">
                    <div className="w-full md:w-auto">
                        <img className="w-24 md:w-16" src="/img/creditum.png" alt="" />
                    </div>
                    <div className="opacity-50">
                        <p className="text-sm font-medium">Total Value Locked (TVL)</p>
                        <p className="text-2xl">$69,912,033</p>
                    </div>
                    <div className="opacity-50">
                        <p className="text-sm font-medium">Credit Price</p>
                        <p className="text-2xl">$3.06</p>
                        {/* <p className="text-xs">xCREDIT Price: $3.23</p> */}
                    </div>
                    <div className="opacity-50">
                        <p className="text-sm font-medium">Marketcap</p>
                        <p className="text-2xl">$12,651,971</p>
                        {/* <p className="text-xs">xCREDIT Price: $3.23</p> */}
                    </div>
                </div>

                <div className="space-x-6 font-medium">
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
