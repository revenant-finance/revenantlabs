import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import useCreditum from '../../../hooks/Creditum/useCreditum'
import useCreditumData from '../../../hooks/Creditum/useCreditumData'
import useAlerts from '../../../hooks/useAlerts'
import { commaFormatter, formatter } from '../../../utils'
import Button from '../../Button'
import ConnectWalletButton from '../../ConnectWalletFirstButton'
import DataPoint from '../../DataPoint'
import InfoBanner from '../../InfoBanner'
import Input from '../../Input'
import LoadingBanner from '../../LoadingBanner'
import MarketTicker from '../../MarketTicker'
import SlideOpen from '../../SlideOpen'
import MarketInput from './MarketInput'

const MarketItemAccordion = ({ market, invert }) => {
    const { selectedMarket, setSelectedMarket } = useCreditumData()
    const isOpen = selectedMarket?.id === market.id
    const amountBorrowable = market.collateralMintLimit - market.totalMinted

    return (
        <div>
            <button
                onClick={() => setSelectedMarket(market)}
                className={classNames(
                    'w-full  px-4 py-2 flex items-center  transition ease-in-out',
                    isOpen ? 'bg-yellow-400 text-neutral-900' : ' bg-opacity-50',
                    invert && !isOpen && 'bg-neutral-800'
                )}
            >
                <div className="flex items-center flex-1 space-x-2 md:space-x-4">
                    <img className="w-6 h-6" src={`/img/tokens/${market.asset}`} alt="" />
                    <div className="flex items-center space-x-2">
                        <p className="text-xl font-medium">{market.symbol}</p>
                        <p className="opacity-50">${formatter(market.priceUsd)}</p>
                    </div>
                </div>
                <div className="font-mono text-xs text-right md:text-sm">
                    <p
                        className={classNames(
                            !isOpen && amountBorrowable <= 10 && 'text-red-400',
                            !isOpen && amountBorrowable <= 1000 && 'text-yellow-400'
                        )}
                    >
                        {formatter(amountBorrowable)} cUSD
                    </p>
                    <p className="">Borrowable</p>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <SlideOpen
                        className={classNames(
                            'overflow-hidden',
                            isOpen &&
                                ' border-t-2 border-neutral-900 text-neutral-900 bg-yellow-400'
                        )}
                    >
                        <div className="p-6 space-y-4">
                            <div>
                                <DataPoint
                                    title="User Debt"
                                    value={`${commaFormatter(market.userDebt)} cUSD`}
                                    lineClass="bg-neutral-800"
                                />
                                <DataPoint
                                    title="User Deposits"
                                    value={`${commaFormatter(market.userDeposits)} ${
                                        market.symbol
                                    } / $${formatter(market.userDeposits * market.priceUsd)}`}
                                    lineClass="bg-neutral-800"
                                />
                                <DataPoint
                                    title="Current Liquidation Price"
                                    value={`${
                                        Number(market.liquidationPrice) > 9000000
                                            ? 'None'
                                            : commaFormatter(market.liquidationPrice)
                                    }`}
                                    lineClass="bg-neutral-800"
                                />
                                <DataPoint
                                    title="cUSD left to borrow"
                                    value={`${commaFormatter(market.positionLiquidity)}`}
                                    lineClass="bg-neutral-800"
                                />
                            </div>

                            <a
                                href="#market"
                                className="block w-full px-4 py-2 text-xs font-medium text-center border rounded md:hidden border-neutral-800"
                            >
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
    const {
        creditumData,
        selectedMarket,
        setSelectedMarket,
        depositInput,
        setDepositInput,
        borrowInput,
        setBorrowInput,
        repayInput,
        setRepayInput,
        withdrawInput,
        setWithdrawInput,
        showMoreInfo,
        setShowMoreInfo,
        showDepositTool,
        setShowDepositTool,
        showRepayTool,
        setShowRepayTool,
        liquidationPriceDeposit,
        setLiquidationPriceDeposit,
        healthDeposit,
        setHealthDeposit,
        borrowPercent,
        setBorrowPercent,
        newBorrowPercentDeposit,
        setNewBorrowPercentDeposit,
        liquidationPriceRepay,
        setLiquidationPriceRepay,
        healthRepay,
        setHealthRepay,
        newBorrowPercentRepay,
        setNewBorrowPercentRepay
    } = useCreditumData()

    useEffect(() => {
        if (!Object.values(creditumData).length) return
        calculateDepositData()
    }, [selectedMarket])

    const calculateDepositData = () => {
        if (selectedMarket) {
            const _currentCollateralValue = Number(selectedMarket.positionCollateralValue)
            const _currentDebtValue = Number(selectedMarket.positionDebtValue)
            const _borrowPercent =
                (_currentDebtValue * 100) /
                (_currentCollateralValue * selectedMarket.collateralMaxDebtRatio)
            setBorrowPercent(_borrowPercent)
        }
    }

    const { enter, exit, stabilizerMint, stabilizerRedeem } = useCreditum()

    const { newAlert, clearAlert } = useAlerts()

    const markets = creditumData?.cusd?.collaterals

    const [depositStatus, setDepositStatus] = useState('idle')
    const [withdrawStatus, setWithdrawStatus] = useState('idle')

    const onDeposit = () => {
        try {
            setDepositStatus('loading')
            newAlert({
                title: 'Depositing...',
                subtitle: `Depositing ${selectedMarket.symbol}... please complete the process with your wallet.`,
                type: 'info'
            })
            enter(
                selectedMarket,
                depositInput ? depositInput : '0',
                borrowInput ? borrowInput : '0'
            )
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
            newAlert({
                title: 'Repaying...',
                subtitle: `Repaying cUSD. Please complete the process with your wallet.`,
                type: 'info'
            })
            exit(selectedMarket, withdrawInput ? withdrawInput : '0', repayInput ? repayInput : '0')
            newAlert({
                title: 'Transaction Complete',
                subtitle: `Repayment complete.`,
                type: 'info'
            })
            setWithdrawStatus('idle')
        } catch (error) {
            setWithdrawStatus('error')
            newAlert({ title: 'Repayment Failed', subtitle: 'Please try again.', mood: 'negative' })
        }
    }

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            <InfoBanner
                header="Markets"
                title="Stabilize your fortunes by minting cUSD."
                subtitle="Users can deposit crypto assets as collateral to mint cUSD, a stablecoin pegged to USD. Interest rates are fixed so no need to worry about market fluctuation. cUSD and CREDIT can be used for various farming rewards."
            />

            <div className="col-span-2">
                <MarketTicker />
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-8">
                    {!markets && <LoadingBanner title="Markets are loading..." />}

                    <AnimatePresence>
                        {markets && (
                            <SlideOpen>
                                <div className="space-y-8 shadow-2xl bg-neutral-800 bg-opacity-50 border-2 border-neutral-800 rounded-2xl overflow-hidden">
                                    <div className="">
                                        {markets.map((market, index) => (
                                            <MarketItemAccordion
                                                key={index}
                                                market={market}
                                                invert={!(index % 2 === 0)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </SlideOpen>
                        )}
                    </AnimatePresence>
                </div>

                {!selectedMarket && (
                    <div>
                        <LoadingBanner title="Select a Market" animated={false} />
                    </div>
                )}

                {selectedMarket && (
                    <>
                        <div className="space-y-8" id="market">
                            <div className="space-y-4">
                                <div className="">
                                    <DataPoint
                                        title="Total Deposits"
                                        value={`${formatter(selectedMarket.contractBalance)} ${
                                            selectedMarket.symbol
                                        }`}
                                        lineClass="bg-white bg-opacity-20"
                                    />
                                    <DataPoint
                                        title="Total Deposits (USD)"
                                        value={`$${formatter(
                                            selectedMarket.contractBalance * selectedMarket.priceUsd
                                        )} USD`}
                                        lineClass="bg-white bg-opacity-20"
                                    />
                                    <DataPoint
                                        title="Total Minted"
                                        value={`${formatter(selectedMarket.totalMinted)} cUSD`}
                                        lineClass="bg-white bg-opacity-20"
                                    />
                                    <DataPoint
                                        title="Borrowing Interest Rate"
                                        value={`${formatter(
                                            selectedMarket.collateralStabilityFee * 100
                                        )}%`}
                                        lineClass="bg-white bg-opacity-20"
                                    />

                                    <AnimatePresence>
                                        {showMoreInfo && (
                                            <SlideOpen>
                                                <div>
                                                    <DataPoint
                                                        title={`${selectedMarket.symbol} Price`}
                                                        value={`$${formatter(
                                                            selectedMarket.priceUsd
                                                        )} USD`}
                                                        lineClass="bg-white bg-opacity-20"
                                                    />
                                                    <DataPoint
                                                        title="Collateral Mint Limit"
                                                        value={`${formatter(
                                                            selectedMarket.collateralMintLimit
                                                        )}`}
                                                        lineClass="bg-white bg-opacity-20"
                                                    />
                                                    <DataPoint
                                                        title="LTV/Max Debt Ratio"
                                                        value={`${formatter(
                                                            selectedMarket.collateralMaxDebtRatio *
                                                                100
                                                        )}%`}
                                                        lineClass="bg-white bg-opacity-20"
                                                    />
                                                    <DataPoint
                                                        title="Mint Fee"
                                                        value={`${formatter(
                                                            selectedMarket.collateralMintFee * 100
                                                        )}%`}
                                                        lineClass="bg-white bg-opacity-20"
                                                    />
                                                    <DataPoint
                                                        title="Liquidation Penalty"
                                                        value={`${formatter(
                                                            selectedMarket.collateralLiquidationPenalty *
                                                                100
                                                        )}%`}
                                                        lineClass="bg-white bg-opacity-20"
                                                    />
                                                    <DataPoint
                                                        title="Liquidation Threshold"
                                                        value={`${formatter(
                                                            selectedMarket.collateralLiquidationThreshold *
                                                                100
                                                        )}%`}
                                                        lineClass="bg-white bg-opacity-20"
                                                    />
                                                </div>
                                            </SlideOpen>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Button
                                    className={classNames(
                                        'border-2 border-neutral-800',
                                        !showMoreInfo
                                            ? 'bg-yellow-400 text-neutral-900'
                                            : 'bg-neutral-800 bg-opacity-50'
                                    )}
                                    onClick={() => setShowMoreInfo((_) => !_)}
                                >
                                    {showMoreInfo ? 'Less Info' : 'More Info'}
                                </Button>
                            </div>

                            <MarketInput type="deposit" />
                            <MarketInput type="repay" />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
