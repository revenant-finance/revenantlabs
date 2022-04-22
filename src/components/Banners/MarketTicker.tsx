import Ticker from 'react-ticker'
import ReactTyped from 'react-typed'
import useCreditumData from '../../Creditum/hooks/useCreditumData'
import useFarmData from '../../Creditum/hooks/useFarmData'
import useVeCreditData from '../../Creditum/hooks/useVeCreditData'
import { formatter } from '../../utils'

const MarketTickerItem = ({ title, value }) => {
    return (
        <p className="inline-block whitespace-nowrap ">
            <span className="font-medium">{title}: </span>
            <span className="font-extended">{value}</span>
        </p>
    )
}

export default function MarketTicker() {
    const { creditumData, govTokenData } = useCreditumData()
    const { veCreditData } = useVeCreditData()
    const { farmData } = useFarmData()

    let creditumTvl = creditumData?.cusd?.assetOverview.tvl
    let farmTvl = farmData?.tvl

    const xTokenTvl = parseFloat(veCreditData?.xTokenValue) * parseFloat(govTokenData?.tokenPrice)
    const veTokenTvl = parseFloat(veCreditData?.veTokenValue) * parseFloat(govTokenData?.tokenPrice)

    const tvl = creditumTvl + farmTvl + xTokenTvl + veTokenTvl

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-end items-end gap-6">
                    <div className="space-y-1 flex-1">
                        <p className="text-2xl lg:text-4xl font-extended">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-300">
                                ${formatter(tvl)}
                            </span>
                        </p>
                        <p className="text-xs lg:text-lg opacity-75">Total Value Locked (TVL)</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl lg:text-4xl font-extended">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-300">
                                ${formatter(govTokenData?.tokenPrice)}
                            </span>
                        </p>
                        <p className="text-xs lg:text-lg opacity-75">CREDIT Price</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl lg:text-4xl font-extended">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-300">
                                {formatter(govTokenData?.circSupply)}
                            </span>
                        </p>
                        <p className="text-xs lg:text-lg opacity-75">CREDIT Supply</p>
                    </div>
                </div>
                <div className="p-2 bg-opacity-50 border-2 shadow-2xl bg-neutral-800 border-neutral-800 rounded-2xl">
                    {!tvl && (
                        <p className="font-medium text-center opacity-50">
                            <ReactTyped strings={['Loading...']} loop />
                        </p>
                    )}
                    {!!tvl && (
                        <Ticker>
                            {({ index }) => (
                                <>
                                    <div className="flex items-center mr-4 space-x-4">
                                        <MarketTickerItem
                                            title="CREDIT Market Cap"
                                            value={`$${formatter(govTokenData?.marketCap)}`}
                                        />
                                        <MarketTickerItem
                                            title="CREDIT Circulating Supply"
                                            value={`${formatter(govTokenData?.circSupply)}`}
                                        />
                                        <MarketTickerItem
                                            title="CREDIT Price"
                                            value={`$${formatter(govTokenData?.tokenPrice)}`}
                                        />
                                        <MarketTickerItem
                                            title="Creditum Total Value Locked (TVL)"
                                            value={`$${formatter(tvl)}`}
                                        />
                                    </div>
                                </>
                            )}
                        </Ticker>
                    )}
                </div>
            </div>
        </>
    )
}
