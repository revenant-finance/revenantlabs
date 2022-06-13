import { createContext, useContext, useEffect, useState } from 'react'
import MeshBackground from './Backgrounds/MeshBackground'
import * as constants from '../data'
import { useActiveWeb3React } from '../hooks'
import { LiquidityWrapper } from '../hooks/useLiquidity'
import { SwapperWrapper } from '../hooks/useSwapper'
import { EMPTY_ADDRESS, toEth } from '../utils'
import { fetchBalances, getOracleContract } from '../utils/ContractService'
import multicall from '../utils/multicall'
import * as singConstants from '../data'
import Footer from './Footer'
import Header from './Header'

const lpTokenABI = JSON.parse(singConstants.CONTRACT_SING_LP_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

export const DataContext = createContext({})

function useDataInternal() {
    const { account } = useActiveWeb3React()
    const oracleContract = getOracleContract()

    const [data, setData] = useState({})
    const [refresh, setRefresh] = useState(0)

    const tokens = data?.safe?.tokens

    const update = () => setRefresh((_) => _ + 1)

    const formatSingularityData = (
        _token,
        _assetAmount,
        _liabilityAmount,
        _depositCap,
        _pricePerShare,
        _tradingFeeRate,
        _isStablecoin,
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
            depositCap: toEth(_depositCap, _token.decimals),
            pricePerShare: toEth(_pricePerShare),
            tradingFeeRate: String(_tradingFeeRate),
            isStablecoin: _isStablecoin,
            lpUnderlyingBalance: toEth(_lpUnderlyingBalance, _token.decimals),
            tokenPrice: toEth(_tokenPrice),
            lastUpdated: String(_lastUpdated),
            collatRatio: Number(_liabilityAmount)
                ? String(Number(_assetAmount.mul(1000).div(_liabilityAmount)) / 1000)
                : '1'
        }
    }

    useEffect(() => {
        const onLoad = async () => {
            const traunchIds = Object.keys(singConstants.CONTRACT_SINGULARITY[250].traunches)
            const allTraunchData = traunchIds.map((traunchId) => {
                const traunchData =
                    singConstants.CONTRACT_SINGULARITY[250].traunches[`${traunchId}`]
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

                const depositCapCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'depositCap'
                }))

                const pricePerShareCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'getPricePerShare'
                }))

                const tradingFeeRateCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'getTradingFeeRate'
                }))

                const isStablecoinCalls = tokens.map((value) => ({
                    address: value.lpAddress,
                    name: 'isStablecoin'
                }))

                const lpUnderlyingBalanceCalls = tokens.map((value) => ({
                    address: value.address,
                    name: 'balanceOf',
                    params: [value.lpAddress]
                }))

                const traunchCalls = Promise.all([
                    multicall(lpTokenABI, assetsAmountCalls),
                    multicall(lpTokenABI, liabilitiesAmountCalls),
                    multicall(lpTokenABI, depositCapCalls),
                    multicall(lpTokenABI, pricePerShareCalls),
                    multicall(lpTokenABI, tradingFeeRateCalls),
                    multicall(lpTokenABI, isStablecoinCalls),
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
                const tokens = allTraunchData[index].tokens
                const [
                    assetsAmount,
                    liabilitiesAmount,
                    depositCaps,
                    pricePerShares,
                    tradingFeeRates,
                    isStablecoins,
                    lpUnderlyingBalances,
                    walletBalances,
                    lpBalances,
                    tokenPrices
                ] = traunch
                return {
                    router: allTraunchData[index].traunchData.router,
                    tokens: liabilitiesAmount.map((liability, index) => {
                        const tokenData = formatSingularityData(
                            tokens[index],
                            assetsAmount[index][0],
                            liabilitiesAmount[index][0],
                            depositCaps[index][0],
                            pricePerShares[index][0],
                            tradingFeeRates[index][0],
                            isStablecoins[index][0],
                            lpUnderlyingBalances[index][0],
                            walletBalances[index],
                            lpBalances[index],
                            tokenPrices[0][index],
                            tokenPrices[1][index]
                        )
                        return tokenData
                    })
                }
            })

            let finalTraunchData = {}
            for (let i = 0; i < traunchIds.length; i++) {
                finalTraunchData[traunchIds[i]] = formattedTraunchData[i]
            }
            setData(finalTraunchData)
        }

        onLoad()
    }, [account, refresh])

    useEffect(() => {
        const timer = setInterval(() => {
            update()
        }, 2000)
        return () => clearInterval(timer)
    }, [])

    return { tokens, data, update }
}

export function AppWrapper({ children }) {
    const hook = useDataInternal()

    return (
        <DataContext.Provider value={{ ...hook }}>
            <SwapperWrapper>
                <LiquidityWrapper>
                    {/* <NotReadyModal /> */}
                    <Header />
                    <div className="w-full h-full p-6 py-24 bg-center bg-cover">
                        <MeshBackground id="singularity-gradient-colors" />
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                        <div className="relative z-10">{children}</div>
                        <Footer />
                    </div>
                </LiquidityWrapper>
            </SwapperWrapper>
        </DataContext.Provider>
    )
}

export function useData() {
    return useContext<any>(DataContext)
}
