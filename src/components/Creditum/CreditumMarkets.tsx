import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'path/posix'
import { useEffect, useState } from 'react'
import useCreditumData from '../../hooks/Creditum/useCreditumData'
import useFarmData from '../../hooks/Creditum/useFarmData'
import { formatter } from '../../utils'
import Button from '../Button'
import DataPoint from '../DataPoint'
import InfoBanner from '../InfoBanner'
import LoadingBanner from '../LoadingBanner'
import SlideOpen from '../SlideOpen'

const MarketItemAccordion = ({ market, invert }) => {
    const { selectedMarket, setSelectedMarket } = useCreditumData()
    const open = selectedMarket?.id === market.id

    // useEffect(() => console.log(market), [market])

    return (
        <div>
            <button onClick={() => setSelectedMarket(market)} className={classNames('w-full  px-4 py-2 flex items-center  transition ease-in-out', invert && 'bg-neutral-800', open ? 'bg-yellow-400 text-neutral-900' : ' bg-opacity-50')}>
                <div className="flex items-center flex-1 space-x-2 md:space-x-4">
                    <img className="w-8 h-8" src={`/img/tokens/${market.asset}`} alt="" />
                    <div className="flex items-center space-x-2">
                        <p className="font-medium text-xl">{market.symbol}</p>
                        <p className="opacity-50">${formatter(market.priceUsd)}</p>
                    </div>
                </div>
                <div className="font-mono text-xs text-right md:text-sm">
                    <p className="">$123,231</p>
                    <p className="">Borrowable</p>
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <SlideOpen className={classNames('overflow-hidden', open && ' border-t-2 border-neutral-900 text-neutral-900 bg-yellow-400')}>
                        <div className="p-6 space-y-4">
                            <div>
                                <DataPoint title="User Debt" value="0.00 cUSD" />
                                <DataPoint title="User Deposits" value="0.00 ETH / $0.00" />
                                <DataPoint title="Current Liquidation Price" value="$0" />
                                <DataPoint title="cUSD left to borrow" value="0 cUSD" />
                            </div>

                            <a href="#market" className="block md:hidden border  w-full border-neutral-800 text-xs font-medium px-4 py-2 rounded text-center">
                                Interact with Market
                            </a>
                        </div>
                    </SlideOpen>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function CreditumMarkets() {
    const { creditumData, selectedMarket, setSelectedMarket, depositInput, setDepositInput, borrowInput, setBorrowInput, repayInput, setRepayInput, withdrawInput, setWithdrawInput, showMoreInfo, setShowMoreInfo, showDepositTool, setShowDepositTool, showRepayTool, setShowRepayTool } = useCreditumData()
    const { farmData } = useFarmData()
    const markets = creditumData?.cusd

    return (
        <div className="w-full p-6 py-24 mx-auto max-w-7xl space-y-12">
            {/* <div className="py-6 md:py-12 w-full flex flex-wrap items-center justify-center gap-6 md:gap-12 text-center">
                <div className="">
                    <p className="text-3xl">$123,123,123</p>
                    <p className="opacity-50 text-sm font-medium">Total Collateral Amount</p>
                </div>
                <div className="">
                    <p className="text-3xl">$123,123,123</p>
                    <p className="opacity-50 text-sm font-medium">Total Amount Minted</p>
                </div>
                <div className="">
                    <p className="text-3xl">86%</p>
                    <p className="opacity-50 text-sm font-medium">Utilization Ration</p>
                </div>
            </div> */}

            <InfoBanner header="Markets" title="Stabilize your fortunes by mint cUSD." subtitle="Dolore velit proident ex reprehenderit et. Cillum esse duis duis consequat anim commodo quis nulla sunt tempor. Quis et est officia dolor incididunt nisi nulla. Commodo ipsum esse eiusmod voluptate." />

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-8">
                    {!markets && <LoadingBanner title="Markets are loading..." />}

                    {markets && (
                        <>
                            <div className="space-y-8">
                                <div className="">
                                    {markets.map((market, index) => (
                                        <MarketItemAccordion market={market} invert={!(index % 2 === 0)} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {!selectedMarket && (
                    <div>
                        <div className="flex items-center justify-center border-4 border-dotted border-neutral-700">
                            <p className="p-6 py-24 font-mono opacity-50">Select a Market</p>
                        </div>
                    </div>
                )}

                {selectedMarket && (
                    <>
                        <div className="space-y-8" id="market">
                            <div className="space-y-4">
                                <div className="">
                                    <DataPoint title="Total Deposits" value={`${formatter(selectedMarket.contractBalance)} ${selectedMarket.symbol}`} />
                                    <DataPoint title="Total Deposits (USD)" value={`$${formatter(selectedMarket.contractBalance * selectedMarket.priceUsd)} ${selectedMarket.symbol}`} />
                                    <DataPoint title="Total Minted" value={`${formatter(selectedMarket.totalMinted)} cUSD`} />

                                    <AnimatePresence>
                                        {showMoreInfo && (
                                            <SlideOpen>
                                                <div>
                                                    <DataPoint title="Collateral Mint Limit" value={`${formatter(selectedMarket.collateralMintLimit)}`} />
                                                    <DataPoint title="Borrowing Interest Rate" value={`${formatter(selectedMarket.collateralStabilityFee * 100)}%`} />
                                                    <DataPoint title="LTV/Max Debt Ratio" value={`${formatter(selectedMarket.collateralMaxDebtRatio * 100)}%`} />
                                                    <DataPoint title="Mint Fee" value={`${formatter(selectedMarket.collateralMintFee * 100)}%`} />
                                                    <DataPoint title="Liquidation Penalty" value={`${formatter(selectedMarket.collateralLiquidationPenalty * 100)}%`} />
                                                    <DataPoint title="Liquidation Threshold" value={`${formatter(selectedMarket.collateralLiquidationThreshold * 100)}%`} />
                                                </div>
                                            </SlideOpen>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Button className="border rounded border-neutral-800 w-full text-xs" onClick={() => setShowMoreInfo((_) => !_)}>
                                    {showMoreInfo ? 'Less Info' : 'More Info'}
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <button className={classNames('border w-full border-neutral-800 p-4 rounded space-y-2 text-left  hover:opacity-100 transition ease-in-out', showDepositTool ? 'opacity-100' : 'opacity-75')} onClick={() => setShowDepositTool((_) => !_)}>
                                    <div className="flex items-center space-x-4">
                                        <p className="text-2xl font-medium">
                                            Deposit {selectedMarket.symbol}, borrow cUSD
                                            {/* Deposit <span className="opacity-50">/ Borrow</span> */}
                                        </p>
                                    </div>
                                    <p className="opacity-50">Deposit your ${selectedMarket.symbol} to create a collateralized position and mint cUSD against it, instantly.</p>
                                </button>
                                <AnimatePresence>
                                    {showDepositTool && (
                                        <SlideOpen className="space-y-2">
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
                                                    <DataPoint title="Borrowed Amount" value="0.0 => 0.1" />
                                                    <DataPoint title="Liquidation Price" value="0.0" />
                                                    <DataPoint title="Health Factor" value="0.0" />
                                                </div>
                                            )}
                                            <button disabled={!depositInput && !borrowInput} className={classNames('w-full p-2 text-white bg-green-800 rounded hover:bg-green-900', !depositInput && !borrowInput && 'opacity-50')}>
                                                Deposit & Borrow
                                            </button>
                                        </SlideOpen>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="space-y-4">
                                <button className={classNames('border w-full border-neutral-800 p-4 rounded space-y-2 text-left  hover:opacity-100 transition ease-in-out', showRepayTool ? 'opacity-100' : 'opacity-75')} onClick={() => setShowRepayTool((_) => !_)}>
                                    <div className="flex items-center space-x-4">
                                        <p className="text-2xl font-medium">
                                            Repay cUSD, Withdraw {selectedMarket.symbol}
                                            {/* Repay <span className="opacity-50">/ Withdraw</span> */}
                                        </p>
                                    </div>
                                    <p className="opacity-50">Repay your cUSD loans and withdraw your {selectedMarket.symbol} back into your wallet.</p>
                                </button>

                                <AnimatePresence>
                                    {showRepayTool && (
                                        <SlideOpen className="space-y-2">
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
                                        </SlideOpen>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
