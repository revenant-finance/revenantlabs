import Ticker from 'react-ticker'
import useCreditumData from '../hooks/Creditum/useCreditumData'
import useFarmData from '../hooks/Creditum/useFarmData'
import useVeCreditData from '../hooks/Creditum/useVeCreditData'
import { formatter } from '../utils'
import usePrice from '../hooks/usePrice'
import { useEffect, useState } from 'react'
import { getTokenContract } from '../utils/ContractService'
import { toEth } from '../utils'
import { CONTRACT_CREDITUM } from '../data'
import { useActiveWeb3React } from '../hooks'
import ReactTyped from 'react-typed'

const creditum = CONTRACT_CREDITUM[250].token

const MarketTickerItem = ({ title, value }) => {
    return (
        <p className="inline-block whitespace-nowrap">
            <span className="font-medium">{title}: </span>
            <span className="font-light">{value}</span>
        </p>
    )
}

export default function MarketTicker() {
    const { creditumData, govTokenData } = useCreditumData()
    const { veCreditData } = useVeCreditData()
    const { farmData } = useFarmData()

    let creditumTvl = creditumData?.cusd?.assetOverview.tvl
    let farmTvl = farmData?.tvl

    const xTokenTvl = parseFloat(veCreditData.xTokenValue) * parseFloat(govTokenData?.tokenPrice)
    const veTokenTvl = parseFloat(veCreditData.veTokenValue) * parseFloat(govTokenData?.tokenPrice)

    const tvl = creditumTvl + farmTvl + xTokenTvl + veTokenTvl

    return (
        <div className="p-2 bg-yellow-400 text-neutral-900 rounded-2xl">
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
                                <MarketTickerItem title="Market Cap" value={formatter(govTokenData?.marketCap)} />
                                <MarketTickerItem title="CREDIT Circulating Supply" value={formatter(govTokenData?.circSupply)} />
                                <MarketTickerItem title="$CREDIT Price" value={`$${formatter(govTokenData?.tokenPrice)}`} />
                                <MarketTickerItem title="Total Value Locked (TVL)" value={`$${formatter(tvl)}`} />
                                {/* <MarketTickerItem title="Total Collateral Amount" value={formatter(999999999)} /> */}
                                {/* <MarketTickerItem title="Total cUSD Minted" value={Object.keys(creditumData).length ? formatter(creditumData?.cusd.assetOverview.totalMinted) : 'loading'} /> */}
                                {/* <MarketTickerItem title="Market Utilization Ratio" value={formatter(999999999)} /> */}
                            </div>
                        </>
                    )}
                </Ticker>
            )}
        </div>
    )
}
