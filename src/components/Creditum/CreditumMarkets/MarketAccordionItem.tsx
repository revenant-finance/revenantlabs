import classNames from 'classnames'
import { AnimatePresence } from 'framer-motion'
import useCreditumData from '../../../hooks/Creditum/useCreditumData'
import { commaFormatter, formatter } from '../../../utils'
import DataPoint from '../../DataPoint'
import SlideOpen from '../../SlideOpen'

export default function MarketAccordionItem({ market, invert }) {
    const { selectedMarket, setSelectedMarket } = useCreditumData()
    const isOpen = selectedMarket?.id === market.id
    const amountBorrowable = market.collateralMintLimit - market.totalMinted

    // useEffect(() => console.log(market), [])

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
                <div className="flex flex-1 items-center space-x-2 md:space-x-4">
                    <img className="w-6 h-6" src={`/img/tokens/${market.asset}`} alt="" />
                    <div className="flex items-center space-x-2">
                        <p className="text-lg md:text-xl font-medium whitespace-nowrap">
                            {market.symbol}
                        </p>
                        <p className="opacity-50">${formatter(market.priceUsd)}</p>
                    </div>
                </div>
                <div className="font-mono text-xs text-right md:text-sm">
                    <p
                        className={classNames(
                            'hidden md:block',
                            !isOpen && amountBorrowable <= 10 && 'text-red-400',
                            !isOpen && amountBorrowable <= 1000 && 'text-yellow-400'
                        )}
                    >
                        <span className="opacity-75">Available: </span>
                        <span className="font-medium">{formatter(amountBorrowable)} cUSD</span>
                    </p>
                    <p>
                        <span className="opacity-75">Wallet Balance: </span>
                        <br className="block sm:hidden" />
                        <span className="font-medium">
                            {formatter(market.walletBalance)} {market.symbol}
                        </span>
                    </p>
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
