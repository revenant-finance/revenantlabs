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
    const [tvl, setTvl] = useState(0)
    const [supply, setSupply] = useState(0)
    const [marketCap, setMarketCap] = useState(0)
    const [tokenPrice, setTokenPrice] = useState('0')
    const { creditumData, refreshing } = useCreditumData()
    const { veCreditData } = useVeCreditData()
    const { farmData } = useFarmData()
    const { getPrice } = usePrice()
    const { library } = useActiveWeb3React()

    useEffect(() => {
        if (!library) return
        if (Object.keys(creditumData).length && Object.keys(farmData).length && veCreditData?.xTokenValue !== '0') {
            getCirculatingSupply()
        }
    }, [Object.keys(creditumData).length, Object.keys(farmData).length, refreshing, veCreditData, tokenPrice])

    const getTvl = (_tokenPrice) => {
        let creditumTvl = creditumData.cusd.assetOverview.tvl
        let farmTvl = farmData.tvl

        const xTokenTvl = parseFloat(veCreditData?.xTokenValue) * parseFloat(_tokenPrice)
        const veTokenTvl = parseFloat(veCreditData?.veTokenValue) * parseFloat(_tokenPrice)

        const totalTvl = creditumTvl + xTokenTvl + farmTvl + veTokenTvl
        setTvl(totalTvl)
    }

    const getCirculatingSupply = async () => {
        const MAX_SUPPLY = 50000000
        const creditumContract = getTokenContract(creditum.address, library)
        const [vesting, vestingSeb, multisig, farming, revenant, _tokenPrice] = await Promise.all([
            creditumContract.balanceOf('0x96AF48D95bf6e226D9696d6E074f40002407fEcC'),
            creditumContract.balanceOf('0x270144231ef669010780f2e72fb414d056baba40'),
            creditumContract.balanceOf('0x667D9921836BB8e7629B3E0a3a0C6776dB538029'),
            creditumContract.balanceOf('0xe0c43105235C1f18EA15fdb60Bb6d54814299938'),
            creditumContract.balanceOf('0x3A276b8bfb9DEC7e19E43157FC9142B95238Ab6f'),
            getPrice(creditum.address)
        ])
        const circSupply = MAX_SUPPLY - Number(toEth(vesting)) - Number(toEth(multisig)) - Number(toEth(farming)) - Number(toEth(revenant))
        const _marketCap = circSupply * _tokenPrice
        getTvl(_tokenPrice)
        setTokenPrice(_tokenPrice)
        setSupply(circSupply)
        setMarketCap(_marketCap)
    }

    return (
        <div className="p-2 bg-yellow-400 text-neutral-900">
            {marketCap && <Ticker>
                {({ index }) => (
                    <>
                        <div className="flex items-center mr-4 space-x-4">
                            <MarketTickerItem title="Market Cap" value={formatter(marketCap)} />
                            <MarketTickerItem title="CREDIT Circulating Supply" value={formatter(supply)} />
                            <MarketTickerItem title="$CREDIT Price" value={`$${formatter(tokenPrice)}`} />
                            <MarketTickerItem title="Total Value Locked (TVL)" value={`$${formatter(tvl)}`} />
                            {/* <MarketTickerItem title="Total Collateral Amount" value={formatter(999999999)} /> */}
                            {/* <MarketTickerItem title="Total cUSD Minted" value={Object.keys(creditumData).length ? formatter(creditumData?.cusd.assetOverview.totalMinted) : 'loading'} /> */}
                            {/* <MarketTickerItem title="Market Utilization Ratio" value={formatter(999999999)} /> */}
                        </div>
                    </>
                )}
            </Ticker>}
        </div>
    )
}
