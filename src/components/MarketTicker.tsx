import Ticker from 'react-ticker'
import ReactTyped from 'react-typed'
import useCreditumData from '../hooks/Creditum/useCreditumData'
import useFarmData from '../hooks/Creditum/useFarmData'
import useVeCreditData from '../hooks/Creditum/useVeCreditData'
import { formatter } from '../utils'

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
    )
}
