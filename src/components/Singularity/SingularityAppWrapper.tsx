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
import SingularityHeader from './SingularityHeader'

const lpTokenABI = JSON.parse(constants.CONTRACT_SING_LP_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

export function SingularityAppWrapper({ children }) {
    return (
        <SingularityDataWrapper>
            <SingularitySwapperWrapper>
                <SingularityLiquidityWrapper>
                    <SingularityHeader />
                    <div className="w-full h-full p-6 py-24 bg-center bg-cover">
                        <MeshBackground id="singularity-gradient-colors" />
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                        <div className="relative z-10">{children}</div>
                    </div>
                </SingularityLiquidityWrapper>
            </SingularitySwapperWrapper>
        </SingularityDataWrapper>
    )
}

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

function useSingularityDataInternal() {
    const { slowRefresh } = useRefresh()
    const { account } = useActiveWeb3React()
    const oracleContract = getSingOracleContract()
    const [data, setData] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [refresh, setRefresh] = useState(0)

    const update = () => setRefresh((i) => i + 1)

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
                        tokenPrices[0][j],
                        tokenPrices[1][j]
                    )
                    formattedTokenData.push(tokenData)
                }
                formattedSingularityData[`${traunchIds[i]}`] = {
                    tokens: formattedTokenData,
                    router: allTraunchData[i].traunchData.router
                }
            })

            console.log('refreshing collaterals result ===== ')
            setData(formattedSingularityData)
            setRefreshing(false)
        }

        fetchData()
    }, [account, slowRefresh, refresh])

    const tokens = data?.safe?.tokens

    return { tokens, data, refreshing, update }
}

export const SingularityDataContext = createContext({})

export function SingularityDataWrapper({ children }: any) {
    const data = useSingularityDataInternal()

    return (
        <>
            <SingularityDataContext.Provider value={{ ...data }}>
                <>{children}</>
            </SingularityDataContext.Provider>
        </>
    )
}

export function useSingularityData() {
    return useContext<any>(SingularityDataContext)
}
