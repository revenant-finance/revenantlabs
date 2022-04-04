import { createContext, useContext, useEffect, useState } from 'react'
import * as constants from '../../data'
import { useActiveWeb3React } from '../../hooks'
import useRefresh from '../../hooks/useRefresh'
import { SingularityLiquidityWrapper } from '../../hooks/useSingularityLiquidity'
import { SingularitySwapperWrapper } from '../../hooks/useSingularitySwapper'
import { EMPTY_ADDRESS, toEth } from '../../utils'
import { fetchBalances, getSingOracleContract } from '../../utils/ContractService'
import multicall from '../../utils/multicall'
import MeshBackground from '../MeshBackground'
import SingularityFooter from './SingularityFooter'
import SingularityHeader from './SingularityHeader'
import useDeepCompareEffect from 'use-deep-compare-effect'

const lpTokenABI = JSON.parse(constants.CONTRACT_SING_LP_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

export const SingularityDataContext = createContext({})

function useSingularityDataInternal() {
    const { fastRefresh } = useRefresh()
    const { account } = useActiveWeb3React()
    const oracleContract = getSingOracleContract()
    const [data, setData] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [refresh, setRefresh] = useState(0)

    const formatSingularityData = (
        _token,
        _assetAmount,
        _liabilityAmount,
        _pricePerShare,
        _tradingFeeRate,
        _lpUnderlyingBalance,
        _walletBalance,
        _lpBalance,
        _tokenPrice,
        _lastUpdated
    ) => {
        return {
            ..._token,
            lpBalance: _lpBalance,
            ..._walletBalance,
            assetAmount: toEth(_assetAmount, _token.decimals),
            liabilityAmount: toEth(_liabilityAmount, _token.decimals),
            pricePerShare: toEth(_pricePerShare),
            tradingFeeRate: String(_tradingFeeRate),
            lpUnderlyingBalance: toEth(_lpUnderlyingBalance, _token.decimals),
            tokenPrice: toEth(_tokenPrice),
            lastUpdated: String(_lastUpdated),
            collatRatio: Number(_liabilityAmount)
                ? String(Number(_assetAmount.mul(1000).div(_liabilityAmount)) / 1000)
                : '0'
        }
    }

    const update = () => setRefresh((i) => i + 1)

    const [test, setTest] = useState({ test: 1 })

    useEffect(() => {
        const onLoad = async () => {
            // let formattedSingularityData = {}
            const traunchIds = Object.keys(constants.CONTRACT_SINGULARITY[250].traunches)
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

            const formattedTraunchData = traunchData.map((traunch, index) => {
                // do something
                // do something
                // do something
                // do something
                // do something
                // do something

                return {}
            })

            // traunchData.forEach((traunch, i) => {
            //     const formattedTokenData = []
            //     const tokens = allTraunchData[i].tokens
            //     const [
            //         assetsAmount,
            //         liabilitiesAmount,
            //         pricePerShares,
            //         tradingFeeRates,
            //         lpUnderlyingBalances,
            //         walletBalances,
            //         lpBalances,
            //         tokenPrices
            //     ] = traunch
            //     for (let j = 0; j < liabilitiesAmount.length; j++) {
            //         const tokenData = formatSingularityData(
            //             tokens[j],
            //             assetsAmount[j][0],
            //             liabilitiesAmount[j][0],
            //             pricePerShares[j][0],
            //             tradingFeeRates[j][0],
            //             lpUnderlyingBalances[j][0],
            //             walletBalances[j],
            //             lpBalances[j],
            //             tokenPrices[0][j],
            //             tokenPrices[1][j]
            //         )
            //         formattedTokenData.push(tokenData)
            //     }
            //     formattedSingularityData[`${traunchIds[i]}`] = {
            //         tokens: formattedTokenData,
            //         router: allTraunchData[i].traunchData.router
            //     }
            // })

            setData(traunchData)
            console.log(`formattedSingularityData`, formattedSingularityData)
            // setData(formattedSingularityData)
        }

        onLoad()
    }, [account, test])

    const tokens = data?.safe?.tokens

    useEffect(() => {
        const timer = setInterval(() => {
            setTest((prev) => ({
                test: prev.test + 1
            }))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return { tokens, data, refreshing, update, test }
}

export function SingularityAppWrapper({ children }) {
    const hook = useSingularityDataInternal()

    return (
        <SingularityDataContext.Provider value={{ ...hook }}>
            <SingularitySwapperWrapper>
                <SingularityLiquidityWrapper>
                    <SingularityHeader />
                    <div className="w-full h-full p-6 py-24 bg-center bg-cover">
                        <MeshBackground id="singularity-gradient-colors" />
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                        <div className="relative z-10">
                            {JSON.stringify(hook.data)}
                            {JSON.stringify(hook.test)}

                            {children}
                        </div>
                        <SingularityFooter />
                    </div>
                </SingularityLiquidityWrapper>
            </SingularitySwapperWrapper>
        </SingularityDataContext.Provider>
    )
}

export function useSingularityData() {
    return useContext<any>(SingularityDataContext)
}
