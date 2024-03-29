import classNames from 'classnames'
import { AnimatePresence } from 'framer-motion'
import useCreditumData from '../hooks/useCreditumData'
import { formatter } from '../../utils'
import Button from '../../components/Btns/Button'
import DataPoint from '../../components/DataPoint/DataPoint'
import InfoBanner from '../../components/Banners/InfoBanner'
import LoadingBanner from '../../components/Loaders/LoadingBanner'
import MarketTicker from '../../components/Banners/MarketTicker'
import SlideOpen from '../../components/Utils/SlideOpen'
import MarketAccordionItem from './MarketAccordionItem'
import MarketInput from './MarketInput'

export default function CreditumMarkets() {
    const { creditumData, selectedMarket, showMoreInfo, setShowMoreInfo } = useCreditumData()
    const markets = creditumData?.cusd?.collaterals

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            <div className="col-span-2">
                <MarketTicker />
            </div>

            <InfoBanner
                header="Markets"
                title="Stabilize your fortunes by minting cUSD."
                subtitle="Users can deposit crypto assets as collateral to mint cUSD, a stablecoin pegged to USD. Interest rates are fixed so no need to worry about market fluctuation. cUSD and CREDIT can be used for various farming rewards."
            />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-8">
                    {!markets && <LoadingBanner title="Markets are loading..." />}

                    <AnimatePresence>
                        {markets && (
                            <SlideOpen>
                                <div className="shadow-2xl bg-neutral-800 bg-opacity-50 border-2 border-neutral-800 rounded-2xl overflow-hidden">
                                    {!selectedMarket && (
                                        <div className="bg-neutral-800 text-neutral-500 text-xs p-2 text-center">
                                            <p className="text-xs">
                                                Select a market to get started.
                                            </p>
                                        </div>
                                    )}
                                    <div className="">
                                        {markets.map((market, index) => (
                                            <MarketAccordionItem
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
