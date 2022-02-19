import classNames from 'classnames'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useCreditum from '../../hooks/Creditum/useCreditum'
import useCreditumData from '../../hooks/Creditum/useCreditumData'
import useAlerts from '../../hooks/useAlerts'
import { formatter } from '../../utils'
import Button from '../Button'
import ConnectWalletButton from '../ConnectWalletFirstButton'
import DataPoint from '../DataPoint'
import InfoBanner from '../InfoBanner'
import Input from '../Input'
import LoadingBanner from '../LoadingBanner'
import MarketTicker from '../MarketTicker'
import SlideOpen from '../SlideOpen'

const MarketItemAccordion = ({ market, invert }) => {
    const { selectedMarket, setSelectedMarket } = useCreditumData()

    const isOpen = selectedMarket?.id === market.id
    const amountBorrowable = market.collateralMintLimit - market.totalMinted

    // useEffect(() => console.log(market), [market])

    return (
        <div>
            <button onClick={() => setSelectedMarket(market)} className={classNames('w-full  px-4 py-2 flex items-center  transition ease-in-out', isOpen ? 'bg-yellow-400 text-neutral-900' : ' bg-opacity-50', invert && !isOpen && 'bg-neutral-800')}>
                <div className="flex items-center flex-1 space-x-2 md:space-x-4">
                    <img className="w-8 h-8" src={`/img/tokens/${market.asset}`} alt="" />
                    <div className="flex items-center space-x-2">
                        <p className="text-xl font-medium">{market.symbol}</p>
                        <p className="opacity-50">${formatter(market.priceUsd)}</p>
                    </div>
                </div>
                <div className="font-mono text-xs text-right md:text-sm">
                    <p className={classNames(!isOpen && amountBorrowable <= 10 && 'text-red-400', !isOpen && amountBorrowable <= 1000 && 'text-yellow-400')}>{formatter(amountBorrowable)} cUSD</p>
                    <p className="">Borrowable</p>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <SlideOpen className={classNames('overflow-hidden', isOpen && ' border-t-2 border-neutral-900 text-neutral-900 bg-yellow-400')}>
                        <div className="p-6 space-y-4">
                            <div>
                                <DataPoint title="User Debt" value={`${formatter(market.userDebt)} cUSD`} />
                                <DataPoint title="User Deposits" value="0.00 ETH / $0.00" />
                                <DataPoint title="Current Liquidation Price" value={`${formatter(market.liquidationPrice)}`} />
                                <DataPoint title="cUSD left to borrow" value="0 cUSD" />
                            </div>

                            <a href="#market" className="block w-full px-4 py-2 text-xs font-medium text-center border rounded md:hidden border-neutral-800">
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

    const { enter, exit, stabilizerMint, stabilizerRedeem } = useCreditum()

    const { newAlert, clearAlert } = useAlerts()

    const markets = creditumData?.cusd?.collaterals

    const [depositStatus, setDepositStatus] = useState('idle')
    const [withdrawStatus, setWithdrawStatus] = useState('idle')

    const onDeposit = () => {
        try {
            setDepositStatus('loading')
            newAlert({ title: 'Depositing...', subtitle: `Depositing ${selectedMarket.symbol}... please complete the process with your wallet.`, type: 'info' })
            enter(selectedMarket, depositInput, borrowInput)
            newAlert({ title: 'Transaction Complete', subtitle: `Deposit complete.`, type: 'info' })
            setDepositStatus('idle')
        } catch (error) {
            setDepositStatus('error')
            newAlert({ title: 'Deposit Failed', subtitle: 'Please try again.', mood: 'negative' })
        }
    }

    const onRepay = () => {
        try {
            setWithdrawStatus('loading')
            newAlert({ title: 'Repaying...', subtitle: `Repaying cUSD. Please complete the process with your wallet.`, type: 'info' })
            exit(selectedMarket, depositInput, borrowInput)
            newAlert({ title: 'Transaction Complete', subtitle: `Repayment complete.`, type: 'info' })
            setWithdrawStatus('idle')
        } catch (error) {
            setWithdrawStatus('error')
            newAlert({ title: 'Repayment Failed', subtitle: 'Please try again.', mood: 'negative' })
        }
    }

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            <InfoBanner header="Markets" title="Stabilize your fortunes by mint cUSD." subtitle="Dolore velit proident ex reprehenderit et. Cillum esse duis duis consequat anim commodo quis nulla sunt tempor. Quis et est officia dolor incididunt nisi nulla. Commodo ipsum esse eiusmod voluptate." />

            <MarketTicker />

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-8">
                    {!markets && <LoadingBanner title="Markets are loading..." />}

                    <AnimatePresence>
                        {markets && (
                            <SlideOpen>
                                <div className="space-y-8">
                                    <div className="">
                                        {markets.map((market, index) => (
                                            <MarketItemAccordion key={index} market={market} invert={!(index % 2 === 0)} />
                                        ))}
                                    </div>
                                </div>
                            </SlideOpen>
                        )}
                    </AnimatePresence>
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
                                    <DataPoint title="Total Deposits (USD)" value={`$${formatter(selectedMarket.contractBalance * selectedMarket.priceUsd)} USD`} />
                                    <DataPoint title="Total Minted" value={`${formatter(selectedMarket.totalMinted)} cUSD`} />

                                    <AnimatePresence>
                                        {showMoreInfo && (
                                            <SlideOpen>
                                                <div>
                                                    <DataPoint title={`${selectedMarket.symbol} Price`} value={`$${formatter(selectedMarket.priceUsd)} USD`} />
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

                                <Button className={classNames('border rounded border-neutral-800 w-full text-xs', !showMoreInfo && 'bg-yellow-400 text-neutral-900')} onClick={() => setShowMoreInfo((_) => !_)}>
                                    {showMoreInfo ? 'Less Info' : 'More Info'}
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <button className={classNames('border w-full border-neutral-800 p-4 rounded space-y-1 text-left  hover:opacity-100 transition ease-in-out', showDepositTool ? 'opacity-100' : 'opacity-75')} onClick={() => setShowDepositTool((_) => !_)}>
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
                                                    <Input type="number" value={depositInput} onChange={(e) => setDepositInput(e.target.value)} onMax={() => setDepositInput(100)} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-xs font-medium">Amount of cUSD to borrow.</p>
                                                    <Input type="number" value={borrowInput} onChange={(e) => setBorrowInput(e.target.value)} onMax={() => setBorrowInput(200)} />
                                                </div>
                                            </div>

                                            {(!!depositInput || !!borrowInput) && (
                                                <div className="p-4 bg-white rounded bg-opacity-10">
                                                    <DataPoint title="Borrowed Amount" value="0.0 => 0.1" />
                                                    <DataPoint title="Liquidation Price" value="0.0" />
                                                    <DataPoint title="Health Factor" value="0.0" />
                                                </div>
                                            )}

                                            <ConnectWalletButton>
                                                <Button loading={depositStatus === 'loading'} onClick={() => onDeposit()} disabled={!depositInput && !borrowInput} className="text-white bg-green-800 rounded hover:bg-green-900">
                                                    Deposit & Borrow
                                                </Button>
                                            </ConnectWalletButton>
                                        </SlideOpen>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="space-y-4">
                                <button className={classNames('border w-full border-neutral-800 p-4 rounded space-y-1 text-left  hover:opacity-100 transition ease-in-out', showRepayTool ? 'opacity-100' : 'opacity-75')} onClick={() => setShowRepayTool((_) => !_)}>
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
                                                    <Input type="number" value={repayInput} onChange={(e) => setRepayInput(e.target.value)} onMax={() => setRepayInput(100)} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-xs font-medium">Amount of {selectedMarket.symbol} to withdraw.</p>
                                                    <Input type="number" value={withdrawInput} onChange={(e) => setWithdrawInput(e.target.value)} onMax={() => setRepayInput(400)} />
                                                </div>
                                            </div>

                                            {(!!withdrawInput || !!repayInput) && (
                                                <div className="p-4 bg-white rounded bg-opacity-10">
                                                    <DataPoint title="Borrowed Amount" value="0.0" />
                                                    <DataPoint title="Liquidation Price" value="0.0" />
                                                    <DataPoint title="Health Factor" value="0.0" />
                                                </div>
                                            )}

                                            <ConnectWalletButton>
                                                <Button loading={withdrawStatus === 'loading'} onClick={() => onRepay()} disabled={!withdrawInput && !repayInput} className="text-white bg-blue-800 rounded hover:bg-blue-900">
                                                    Repay & Withdraw
                                                </Button>
                                            </ConnectWalletButton>
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
