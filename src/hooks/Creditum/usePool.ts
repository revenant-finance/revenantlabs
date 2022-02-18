import { useState } from 'react'
import { getFarmsContract, getCrvContract, getTokenContract } from '../../utils/ContractService'
import usePrice from '../usePrice'
import { toEth, SECONDS_PER_YEAR } from '../../utils'
import * as constants from '../../data'
import { useActiveWeb3React } from '..'


export default function usePool() {
    const { library } = useActiveWeb3React()
    const { getPrice } = usePrice()
    const [earnTokenPrices, setEarnTokenPrices] = useState([])

    const earnTokens = constants.CONTRACT_CREDITUM_FARMS[250].earnTokens

    const farmContract = getFarmsContract(library)

    const handleEarnTokenPrices = async () => {
        const earnTokenCalls = earnTokens.map((earnToken) => {
            return getPrice(earnToken.address)
        })
        const prices = await Promise.all(earnTokenCalls)
        setEarnTokenPrices(prices)
        return prices
    }

    const calculateApy = async (farmData, tvl) => {
        let prices = earnTokenPrices
        if (prices.length === 0) {   
            prices = await handleEarnTokenPrices()
        }
        let apy = []
        for (let i = 0; i < earnTokens.length; i++) {
            const adjustedRewards = farmData.poolWeight[i] * earnTokens[i].rps * SECONDS_PER_YEAR
            const rewardsValuePerYear = adjustedRewards * prices[i]
            const calc = (rewardsValuePerYear * 100) / tvl
            apy.push(calc)
        }
        return apy
    }

    const calculateCrv = async (farmData) => {
        const crvContract = getCrvContract(farmData.depositToken, library)

        // Get the share of lpContract that masterChefContract owns
        const [farmBalanceData, lpPriceData, totalSupplyData, token0SupplyData, token1SupplyData] = await Promise.all([
            crvContract.balanceOf(farmContract.address),
            crvContract.get_virtual_price(),
            crvContract.totalSupply(),
            crvContract.balances(0),
            crvContract.balances(1)
        ])

        const farmBalance = parseFloat(toEth(farmBalanceData))
        const lpPrice = parseFloat(toEth(lpPriceData))
        const tvl = farmBalance * lpPrice

        const apy = await calculateApy(farmData, tvl)

        const userBalance = parseFloat(farmData.deposited)
        const totalSupply = parseFloat(toEth(totalSupplyData))
        const token0Supply = parseFloat(toEth(token0SupplyData))
        const token1Supply = parseFloat(toEth(token1SupplyData))

        const userPortionLp = userBalance / totalSupply
        const _userToken0Amount = userPortionLp * token0Supply
        const _userToken1Amount = userPortionLp * token1Supply
        const userLpValue = userBalance * lpPrice

        const userTokens = [
            { token: farmData.token0Symbol, amount: _userToken0Amount },
            { token: farmData.token1Symbol, amount: _userToken1Amount }
        ]

        return {
            apy,
            tvl,
            userTokens,
            userLpValue
        }
    }

    const calculateUni = async (farmData) => {
        const token0Contract = getTokenContract(farmData.uniLpTokenAddresses.token0, library)
        const token1Contract = getTokenContract(farmData.uniLpTokenAddresses.token1, library)
        const lpContract = getTokenContract(farmData.depositToken, library)

        const [lpContractToken0BalData, farmLpBalData, lpTotalSupplyData, lpContractToken1BalData, token1Price] = await Promise.all([
            token0Contract.balanceOf(lpContract.address),
            lpContract.balanceOf(farmContract.address),
            lpContract.totalSupply(),
            token1Contract.balanceOf(lpContract.address),
            getPrice(farmData.uniLpTokenAddresses.token1)
        ])

        const lpContractToken0Bal = Number(toEth(lpContractToken0BalData))

        // Get the share of lpContract that masterChefContract owns
        const farmLpBal = Number(toEth(farmLpBalData))

        // Convert that into the portion of total lpContract = p1
        const lpTotalSupply = Number(toEth(lpTotalSupplyData))

        // Get total wftm value for the lpContract = w1
        const lpContractToken1Bal = Number(toEth(lpContractToken1BalData))

        const portionLp = farmLpBal / lpTotalSupply
        const totalLpToken1Value = portionLp * lpContractToken1Bal * 2
        const tvl = totalLpToken1Value * parseFloat(token1Price)

        const apy = await calculateApy(farmData, tvl)

        const userBalance = parseFloat(farmData.deposited)
        const userPortionLp = userBalance / lpTotalSupply
        const _userToken0Amount = userPortionLp * lpContractToken0Bal
        const _userToken1Amount = userPortionLp * lpContractToken1Bal
        const userLpValue = userPortionLp * lpContractToken1Bal * parseFloat(token1Price) * 2

        const userTokens = [
            { token: farmData.token0Symbol, amount: _userToken0Amount },
            { token: farmData.token1Symbol, amount: _userToken1Amount }
        ]

        return {
            tvl,
            apy,
            userTokens,
            userLpValue
        }
    }

    return { calculateUni, calculateCrv }
}
