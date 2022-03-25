import { createContext, useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '..'
import * as constants from '../../data'
import { EMPTY_ADDRESS, toEth, MAX_UINT256 } from '../../utils'
import {
    fetchBalances,
    getTokenContract,
    getSingLpContract,
    getSingOracleContract,
    getSingRouterContract
} from '../../utils/ContractService'
import multicall from '../../utils/multicall'
import useRefresh from '../useRefresh'

const routerABI = JSON.parse(constants.CONTRACT_SING_ROUTER_ABI)
const factoryABI = JSON.parse(constants.CONTRACT_SING_FACTORY_ABI)
const oracleABI = JSON.parse(constants.CONTRACT_SING_ORACLE_ABI)
const lpTokenABI = JSON.parse(constants.CONTRACT_SING_LP_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

const formatSingularityData = (
    _token,
    _assetAmount,
    _liabilityAmount,
    _pricePerShare,
    _tradingFeeRate,
    _lpUnderlyingBalance,
    _walletBalance,
    _lpBalance,
    _tokenPrice
) => {
    return {
        ..._token,
        ..._lpBalance,
        ..._walletBalance,
        assetAmount: toEth(_assetAmount, _token.decimals),
        liabilityAmount: toEth(_liabilityAmount, _token.decimals),
        pricePerShare: String(_pricePerShare),
        tradingFeeRate: String(_tradingFeeRate),
        _lpUnderlyingBalance: toEth(_lpUnderlyingBalance, _token.decimals),
        tokenPrice: toEth(_tokenPrice[0], _token.decimals),
        lastUpdated: _tokenPrice[1]
    }
}

function useSingularityDataInternal() {
    const { slowRefresh } = useRefresh()
    const [refreshing, setRefreshing] = useState(false)
    const [singularityData, setSingularityData] = useState({})
    const { account } = useActiveWeb3React()
    const oracleContract = getSingOracleContract()

    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    //Oracle
    //getLatestRounds

    //LP
    //getCollateralizationRatio, getPricePerShare, getAmountToUSD, getLpFeeRate, getDepositFee, getWithdrawFee, getSlippageIn, getSlippageOut, getTradingFeeRate, getTradingFees || deposit, withdraw

    //Router
    //getAmountOut || poolFor, swapExactTokensForTokens, swapExactETHForTokens, swapExactTokensForETH, addLiquidity, addLiquidityETH, removeLiquidity, removeLiquidityETH, removeLiquidityWithPermit, removeLiquidityETHWithPermit

    useEffect(() => {
        const fetchData = async () => {
            setRefreshing(true)
            const traunchIds = Object.keys(constants.CONTRACT_SINGULARITY[250].traunches)
            let formattedSingularityData = new Object()
            const allTraunchData = traunchIds.map((traunchId) => {
                const traunchData = constants.CONTRACT_SINGULARITY[250].traunches[`${traunchId}`]
                const tokens = Object.values(traunchData.tokens)
                const tokenAddresses = tokens.map((token) => {
                    return token.address
                })
                let balanceCalls, lpBalanceCalls
                if (account) {
                    balanceCalls = fetchBalances(account, tokens, traunchData.router, 'address')
                    lpBalanceCalls = fetchBalances(account, tokens, traunchData.router, 'lpAddress')
                } else {
                    balanceCalls = fetchBalances(
                        EMPTY_ADDRESS,
                        tokens,
                        traunchData.router,
                        'address'
                    )
                    lpBalanceCalls = fetchBalances(
                        EMPTY_ADDRESS,
                        tokens,
                        traunchData.router,
                        'lpAddress'
                    )
                }

                const assetsAmountCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'assets'
                }))

                const liabilitiesAmountCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'liabilities'
                }))

                const pricePerShareCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'getPricePerShare'
                }))

                const tradingFeeRateCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'getTradingFeeRate'
                }))

                const lpUnderlyingBalanceCalls = tokens.map((value) => ({
                    address: value.address,
                    name: 'balanceOf',
                    params: [value.lpAddress]
                }))

                const traunchCalls = Promise.all([
                    multicall(lpTokenABI, assetsAmountCalls),
                    multicall(lpTokenABI, liabilitiesAmountCalls),
                    multicall(lpTokenABI, pricePerShareCalls),
                    multicall(lpTokenABI, tradingFeeRateCalls),
                    multicall(erc20ABI, lpUnderlyingBalanceCalls),
                    balanceCalls,
                    lpBalanceCalls,
                    oracleContract.getLatestRounds(tokenAddresses)
                ])

                return { traunchCalls, tokens, traunchData }
            })

            const allTraunchCalls = allTraunchData.map((traunch) => {
                return traunch.traunchCalls
            })

            const traunchData = await Promise.all(allTraunchCalls)
            console.log(traunchData)
            traunchData.forEach((traunch, i) => {
                const formattedTokenData = []
                const tokens = allTraunchData[i].tokens
                const [
                    assetsAmount,
                    liabilitiesAmount,
                    pricePerShares,
                    tradingFeeRates,
                    lpUnderlyingBalances,
                    walletBalances,
                    lpBalances,
                    tokenPrices
                ] = traunch
                for (let j = 0; j < liabilitiesAmount.length; j++) {
                    const tokenData = formatSingularityData(
                        tokens[j],
                        assetsAmount[j][0], 
                        liabilitiesAmount[j][0], 
                        pricePerShares[j][0],  
                        tradingFeeRates[j][0],  
                        lpUnderlyingBalances[j][0],  
                        walletBalances[j],     
                        lpBalances[j], 
                        tokenPrices[j]
                    )
                    formattedTokenData.push(tokenData)
                }
                formattedSingularityData[`${traunchIds[i]}`] = { tokens: formattedTokenData, router: allTraunchData[i].traunchData.router  }
            })
            console.log(formattedSingularityData)

            console.log('refreshing collaterals result ===== ')
            setSingularityData(formattedSingularityData)
            setRefreshing(false)
        }
        fetchData()
    }, [account, slowRefresh, refresh])

    return {
        singularityData,
        update,
        refreshing
    }
}

export const SingularityContext = createContext({})

export function SingularityDataWrapper({ children }: any) {
    const [traunch, setTraunch] = useState(null)
    const [token, setToken] = useState(null)
    const { account, library } = useActiveWeb3React()
    const singularityData = useSingularityDataInternal()
    // const routerContract = getSingRouterContract(traunch?.router, library.getSigner())
    // const tokenContract = getTokenContract(token?.address, library?.getSigner())

    const approve = async () => {
        if (!account) return
        try {
            const tx = await tokenContract.approve(traunch?.router, MAX_UINT256)
            await tx.wait(1)
            singularityData.update()
        } catch (ex) {
            console.error(ex)
        }
    }

    // const approve = async () => {
    //     if (!account) return
    //     try {
    //         const tx = await tokenContract.approve(traunch?.router, MAX_UINT256)
    //         await tx.wait(1)
    //         singularityData.update()
    //     } catch (ex) {
    //         console.error(ex)
    //     }
    // }

    return (
        <>
            <SingularityContext.Provider
                value={{
                    ...singularityData
                }}
            >
                <>{children}</>
            </SingularityContext.Provider>
        </>
    )
}

export default function useSingularityData2() {
    return useContext(SingularityContext) as any
}
