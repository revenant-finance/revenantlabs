import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { toEth } from '../utils'
import { getTokenContract } from '../utils/ContractService'
import useFarmData from './Creditum/useFarmData'
import usePrice from './usePrice'

export default function useGeneralData() {
    const creditum = CONTRACT_CREDITUM[250].token
    const [tvl, setTvl] = useState(0)
    const [supply, setSupply] = useState(0)
    const [marketCap, setMarketCap] = useState(0)
    const [tokenPrice, setTokenPrice] = useState('0')
    const { creditumData, refreshing } = useCreditumData()
    const { tokenBalance, xtokenBalance, shareValue, xtokenValue } = useXToken(creditum)
    const { getPrice } = usePrice()
    const wallet = useWallet()
    const { farmData } = useFarmData()

    useEffect(() => {
        if (!wallet.account) return
        getTVL()
        getCirculatingSupply()
    }, [Object.keys(creditumData).length, refreshing, wallet, xtokenValue])

    const getTVL = async () => {
        let creditumTvl = 0
        if (Object.values(creditumData).length) {
            for (const value of Object.values(creditumData)) {
                value.forEach((token, i) => {
                    creditumTvl += Number(token.priceUsd) * token.contractBalance
                })
            }
        }

        let farmTvl = 0
        if (Object.values(farmData).length) {
            for (const farm of farmData) {
                farmTvl += farm?.tvl
            }
        }

        const xTokenTvl = parseFloat(xtokenValue) * parseFloat(tokenPrice)

        const totalTvl = creditumTvl + xTokenTvl + farmTvl
        setTvl(totalTvl)
    }

    const getCirculatingSupply = async () => {
        const MAX_SUPPLY = 50000000
        const creditumContract = getTokenContract(creditum.address, wallet.ethereum)
        const [vesting, multisig, farming, revenant, _tokenPrice] = await Promise.all([
            creditumContract.balanceOf('0x96AF48D95bf6e226D9696d6E074f40002407fEcC'),
            creditumContract.balanceOf('0x667D9921836BB8e7629B3E0a3a0C6776dB538029'),
            creditumContract.balanceOf('0xe0c43105235C1f18EA15fdb60Bb6d54814299938'),
            creditumContract.balanceOf('0x3A276b8bfb9DEC7e19E43157FC9142B95238Ab6f'),
            getPrice(creditum.address)
        ])
        const circSupply = MAX_SUPPLY - Number(toEth(vesting)) - Number(toEth(multisig)) - Number(toEth(farming)) - Number(toEth(revenant))
        const _marketCap = circSupply * _tokenPrice
        setTokenPrice(_tokenPrice)
        setSupply(circSupply)
        setMarketCap(_marketCap)
    }

    return {
        tvl,
        marketCap,
        supply,
        creditPrice: 0,
        xCreditPrice: 0,
        totalCollateralAmount: 0,
        totalAmountMinted: 0,
        marketUtilizationRatio: 0
    }
}
