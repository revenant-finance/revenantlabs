import Link from 'next/link'
import { createContext, useState } from 'react'
import { CreditumDataWrapper } from '../../hooks/Creditum/useCreditumData'
import Footer from '../Footer'

export function CreditumAppWrapper({ children }) {
    const [selectedMarket, setSelectedMarket] = useState(null)

    return (
        <>
            <div className="bg-yellow-500 text-neutral-900 flex flex-col">
                <div className="block h-20" />
                <div className="w-full max-w-7xl mx-auto p-6 md:p-12 space-y-6">
                    <div className="space-x-6 font-medium">
                        <Link href="/creditum" passHref>
                            <a>Markets</a>
                        </Link>
                        <Link href="/creditum/farms" passHref>
                            <a>Farms</a>
                        </Link>
                        <Link href="/creditum/staking" passHref>
                            <a>Staking</a>
                        </Link>
                        {/* <a href="">cUSD Markets</a> */}
                    </div>
                    <div className="flex items-center overflow-auto whitespace-nowrap gap-6">
                        <div>
                            <p className="text-sm font-medium">Total Value Locked (TVL)</p>
                            <p className="text-2xl">$69,912,033</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Credit Price</p>
                            <p className="text-2xl">$3.06</p>
                            {/* <p className="text-xs">xCREDIT Price: $3.23</p> */}
                        </div>
                        <div>
                            <p className="text-sm font-medium">Marketcap</p>
                            <p className="text-2xl">$12,651,971</p>
                            {/* <p className="text-xs">xCREDIT Price: $3.23</p> */}
                        </div>
                        <div className="flex-1" />
                        <div className="px-4 py-2 bg-neutral-900 text-yellow-500">
                            <p className="text-xs font-medium">Wallet</p>
                            <p className="space-x-2">
                                <span>20 xCREDIT</span>
                            </p>
                        </div>

                        <div className="px-4 py-2 bg-neutral-900 text-yellow-500">
                            <p className="text-xs font-medium">Portfolio Value</p>
                            <p className="">$12,651,971</p>
                        </div>
                    </div>
                </div>
            </div>

            {children}
        </>
    )
}
