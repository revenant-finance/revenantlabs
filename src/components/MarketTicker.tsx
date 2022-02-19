import Ticker from 'react-ticker'
import useCreditumData from '../hooks/Creditum/useCreditumData'
import useFarmData from '../hooks/Creditum/useFarmData'
import useVeCreditData from '../hooks/Creditum/useVeCreditData'
import { formatter } from '../utils'

const MarketTickerItem = ({ title, value }) => {
    return (
        <p className="inline-block whitespace-nowrap">
            <span className="font-medium">{title}: </span>
            <span className="font-light">{value}</span>
        </p>
    )
}

export default function MarketTicker() {
    const {} = useCreditumData()
    const {} = useVeCreditData()
    const {} = useFarmData()

    const tvl = () => {
        let number = 100
        number = number + 20
        return number
    }

    return (
        <div className="bg-yellow-400 text-neutral-900 p-2">
            <Ticker>
                {({ index }) => (
                    <>
                        <div className="flex items-center space-x-4 mr-4">
                            <MarketTickerItem title="Market Cap" value={formatter(999999999)} />
                            <MarketTickerItem title="$CREDIT Price" value={formatter(999999999)} />
                            <MarketTickerItem title="Total Value Locked (TVL)" value={`$${formatter(tvl())}`} />
                            <MarketTickerItem title="Total Collateral Amount" value={formatter(999999999)} />
                            <MarketTickerItem title="Total Amount Minted" value={formatter(999999999)} />
                            <MarketTickerItem title="Market Utilization Ratio" value={formatter(999999999)} />
                        </div>
                    </>
                )}
            </Ticker>
        </div>
    )
}
