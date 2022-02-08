import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import useCreditumData from '../../hooks/Creditum/useCreditumData'
import useFarmData from '../../hooks/Creditum/useFarmData'
import DataPoint from '../DataPoint'
import InfoBanner from '../InfoBanner'
import LoadingBanner from '../LoadingBanner'

const MarketItemAccordion = ({ market }) => {
    const { selectedMarket, setSelectedMarket } = useCreditumData()
    const open = selectedMarket?.id === market.id

    return (
        <div>
            <button
                onClick={() => setSelectedMarket(market)}
                className={classNames('w-full  px-4 py-2 flex items-center  transition ease-in-out', selectedMarket?.id === market.id ? 'bg-yellow-500 text-neutral-900' : 'hover:bg-neutral-800')}
            >
                <div className="flex items-center flex-1 space-x-2 md:space-x-4">
                    <img className="w-8 h-8" src={`/img/tokens/${market.asset}`} alt="" />
                    <p className="font-medium">{market.symbol}</p>
                </div>
                <div className="font-mono text-xs text-right md:text-sm">
                    <p className="">$123,231</p>
                    <p className="">Borrowable</p>
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        transition={{ duration: 0.2 }}
                        variants={{
                            open: { height: 'auto' },
                            collapsed: { height: 0 }
                        }}
                        className={classNames('border overflow-hidden border-neutral-800 border-b-0')}
                    >
                        <div className="p-6">
                            <DataPoint title="User Debt" value="0.00 cUSD" />
                            <DataPoint title="User Deposits" value="0.00 ETH / $0.00" />
                            <DataPoint title="Current Liquidation Price" value="$0" />
                            <DataPoint title="cUSD left to borrow" value="0 cUSD" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function CreditumMarkets() {
    const { creditumData, selectedMarket, setSelectedMarket, depositInput, setDepositInput, borrowInput, setBorrowInput, repayInput, setRepayInput, withdrawInput, setWithdrawInput } = useCreditumData()
    const { farmData } = useFarmData()
    const markets = creditumData?.cusd

    return (
        <div className="w-full p-6 py-24 mx-auto max-w-7xl space-y-12">
            <InfoBanner
                title="Stabilize your fortunes by mint cUSD."
                subtitle="Dolore velit proident ex reprehenderit et. Cillum esse duis duis consequat anim commodo quis nulla sunt tempor. Quis et est officia dolor incididunt nisi nulla. Commodo ipsum esse eiusmod voluptate."
            />

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {!selectedMarket && (
                    <div>
                        <div className="flex items-center justify-center border-4 border-dotted border-neutral-700">
                            <p className="p-6 py-24 font-mono opacity-50">Select a Market</p>
                        </div>
                    </div>
                )}

                {selectedMarket && (
                    <>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="">
                                    <DataPoint title="Total Deposits" value="$123,123" />
                                    <DataPoint title="Total Minted" value="$123,123" />
                                    <DataPoint title="Borrowing Interest Rate" value="$123,123" />
                                    <DataPoint title="LTV/Max Debt Ratio" value="$123,123" />
                                    <DataPoint title="Mint Fee" value="$123,123" />
                                    <DataPoint title="Liquidation Penalty" value="$123,123" />
                                    <DataPoint title="Collateral Mint Limit" value="$123,123" />
                                    <DataPoint title="Liquidation Threshold" value="$123,123" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-4">
                                        <p className="text-2xl font-medium">
                                            Deposit {selectedMarket.symbol}, borrow cUSD
                                            {/* Deposit <span className="opacity-50">/ Borrow</span> */}
                                        </p>
                                    </div>
                                    <p className="opacity-50">Deposit your ${selectedMarket.symbol} to create a collateralized position and mint cUSD against it, instantly.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-col gap-2 md:flex-row">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-medium">Amount of {selectedMarket.symbol} to deposit.</p>
                                            <input value={depositInput} onChange={(e) => setDepositInput(e.target.value)} type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-medium">Amount of cUSD to borrow.</p>
                                            <input value={borrowInput} onChange={(e) => setBorrowInput(e.target.value)} type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                    </div>

                                    {(!!depositInput || !!borrowInput) && (
                                        <div className="p-4 bg-white bg-opacity-10 rounded">
                                            <DataPoint title="Borrowed Amount" value="0.0" />
                                            <DataPoint title="Liquidation Price" value="0.0" />
                                            <DataPoint title="Health Factor" value="0.0" />
                                        </div>
                                    )}
                                    <button disabled={!depositInput && !borrowInput} className={classNames('w-full p-2 text-white bg-green-800 rounded hover:bg-green-900', !depositInput && !borrowInput && 'opacity-50')}>
                                        Deposit & Borrow
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-4">
                                        <p className="text-2xl font-medium">
                                            Repay cUSD, Withdraw {selectedMarket.symbol}
                                            {/* Repay <span className="opacity-50">/ Withdraw</span> */}
                                        </p>
                                    </div>
                                    <p className="opacity-50">Repay your cUSD loans and withdraw your {selectedMarket.symbol} back into your wallet.</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex flex-col gap-2 md:flex-row">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-medium">Amount of cUSD to repay.</p>
                                            <input value={repayInput} onChange={(e) => setRepayInput(e.target.value)} type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-medium">Amount of {selectedMarket.symbol} to withdraw.</p>
                                            <input value={withdrawInput} onChange={(e) => setWithdrawInput(e.target.value)} type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                    </div>

                                    {(!!withdrawInput || !!repayInput) && (
                                        <div className="p-4 bg-white bg-opacity-10 rounded">
                                            <DataPoint title="Borrowed Amount" value="0.0" />
                                            <DataPoint title="Liquidation Price" value="0.0" />
                                            <DataPoint title="Health Factor" value="0.0" />
                                        </div>
                                    )}

                                    <button disabled={!withdrawInput && !repayInput} className={classNames('w-full p-2 text-white bg-blue-800 rounded hover:bg-blue-900', !withdrawInput && !repayInput && 'opacity-50')}>
                                        Repay & Withdraw
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="space-y-8">
                    {!markets && <LoadingBanner title="Markets are loading..." />}

                    {markets && (
                        <>
                            <div className="space-y-8">
                                <div className="divide-y divide-neutral-800 border-y border-neutral-800">
                                    {markets.map((market) => (
                                        <MarketItemAccordion market={market} />
                                    ))}
                                </div>
                                <div></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
