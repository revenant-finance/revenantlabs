import useCreditumData from '../../hooks/Creditum/useCreditumData'
import useFarmData from '../../hooks/Creditum/useFarmData'
import ReactTyped from 'react-typed'
import { AnimatePresence, motion } from 'framer-motion'
import classNames from 'classnames'
import { useEffect, useState, createContext, useContext } from 'react'



const CreditumContext = createContext({})

const DataPoint = ({ title, value }) => {
    return (
        <div className="flex items-center space-x-4 text-sm font-medium md:text-lg">
            <p className="">{title}</p>
            <div className="flex-1 h-0.5 md:h-1 bg-neutral-800"></div>
            <p className="font-mono">{value}</p>
        </div>
    )
}

const MarketItemAccordion = ({ market }) => {
    const { selectedMarket, setSelectedMarket } = useContext(CreditumContext)

    // const [open, setOpen] = useState(false)
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
                        key="content"
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
    const [selectedMarket, setSelectedMarket] = useState(null)

    const { creditumData} = useCreditumData()
    const { farmData } = useFarmData()
    console.log(farmData)
    const markets = creditumData?.cusd
    console.log(markets)

    return (
        <CreditumContext.Provider value={{ selectedMarket, setSelectedMarket }}>

        <div className="w-full p-6 py-24 mx-auto max-w-7xl">
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
                                {/* <div className="flex items-center space-x-4">
                      <img className="w-16 h-16" src={`/img/tokens/${selectedMarket.asset}`} alt="" />
                      <p className="text-2xl font-medium">{selectedMarket.symbol} Market</p>
                  </div> */}
                                {/* <div className="p-4 bg-yellow-500 text-neutral-900">
                  <p className="text-sm font-medium">Your Position</p>
                  <p>123</p>
              </div> */}
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
                                            <input type="text" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-medium">Amount of cUSD to borrow.</p>
                                            <input type="text" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                    </div>
                                    <button className="w-full p-2 text-white bg-green-800 rounded hover:bg-green-900">Deposit & Borrow</button>
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
                                            <input type="text" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-xs font-medium">Amount of {selectedMarket.symbol} to withdraw.</p>
                                            <input type="text" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                                        </div>
                                    </div>
                                    <button className="w-full p-2 text-white bg-blue-800 rounded hover:bg-blue-900">Repay & Withdraw</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="space-y-8">
                    {/* <div className="p-6 bg-yellow-500 text-neutral-900">
          <DataPoint title="User Debt" value="0.00 cUSD" />
          <DataPoint title="User Deposits" value="0.00 ETH / $0.00" />
          <DataPoint title="Current Liquidation Price" value="$0" />
          <DataPoint title="cUSD left to borrow" value="0 cUSD" />
      </div> */}

                    {!markets && (
                        <div className="flex items-center justify-center border-4 border-dotted border-neutral-700">
                            <p className="p-6 py-24 font-mono opacity-50">
                                <ReactTyped strings={['Markets are loading...']} loop />
                            </p>
                        </div>
                    )}

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
        </CreditumContext.Provider>

    )
}
