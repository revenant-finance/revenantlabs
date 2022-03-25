import { useContext, useEffect, useState, createContext } from 'react'
import { useActiveWeb3React } from './'
import * as constants from '../data'
import { EMPTY_ADDRESS, toEth, toWei } from '../utils'
import {
    fetchBalances,
    getSingOracleContract,
    getSingRouterContract,
    getTokenContract
} from '../utils/ContractService'
import multicall from '../utils/multicall'
import useRefresh from './useRefresh'
import commaNumber from 'comma-number'
import shortNumber from 'short-number'
import { useRouter } from 'next/router'
import { useCookieState } from 'use-cookie-state'
import BN from 'bignumber.js'
import exp from 'constants'

const lpTokenABI = JSON.parse(constants.CONTRACT_SING_LP_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

export const SingularityContext = createContext({})

export function useSingularityInteral() {
    const router = useRouter()
    const { slowRefresh } = useRefresh()
    const { account, library } = useActiveWeb3React()
    const oracleContract = getSingOracleContract()

    const [lpInput, setLpInput] = useState('')
    const [selectedLp, setSelectedLp] = useState(null)

    const [data, setData] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromValue, _setFromValue] = useState(0.0)
    const [toValue, _setToValue] = useState(0.0)
    const [fromToken, _setFromToken] = useState()
    const [toToken, _setToToken] = useState()

    // URL params `from` and `to`. Matches a token id.
    const [fromTokenUrlParam, setFromTokenUrlParam] = useState()
    const [toTokenUrlParam, setToTokenUrlParam] = useState()
    useEffect(() => setFromTokenUrlParam(router.query.from), [router])
    useEffect(() => setToTokenUrlParam(router.query.to), [router])

    // Cache'd `from` and `to`. Matches a token id.
    const [fromTokenCache, setFromTokenCache] = useCookieState(
        'singularity-from-token',
        fromToken?.id
    )
    const [toTokenCache, setToTokenCache] = useCookieState('singularity-to-token', toToken?.id)

    const [slippage, setSlippage] = useState(0.1)
    const [fromBalance, setFromBalance] = useState(0)
    const [toBalance, setToBalance] = useState(0)

    const tokens = data?.safe?.tokens || []
    const slippageBp = Number((slippage * 100).toFixed(0))
    const priceImpactBp = 10
    const feeBp = 300
    const totalFeesBp = slippageBp + priceImpactBp + feeBp

    const totalFees = new BN(toValue).times(totalFeesBp).div(10000)
    const minimumReceived = new BN(toValue).minus(totalFees).toNumber()

    const fromBalanceEth = fromToken
        ? new BN(fromBalance).div(new BN(10).pow(new BN(fromToken.decimals))).toNumber()
        : 0
    const toBalanceEth = toToken
        ? new BN(toBalance).div(new BN(10).pow(new BN(toToken.decimals))).toNumber()
        : 0

    const routerContract = data.safe && getSingRouterContract(data.safe.router, library.getSigner())

    const update = () => setRefresh((i) => i + 1)

    const setFromToken = async (token: any) => {
        _setFromToken(token)
        setFromTokenCache(token.id)
        setFromValue(0)
    }

    const setToToken = (token: any) => {
        _setToToken(token)
        setToTokenCache(token.id)
        setToValue(0)
    }

    const swapTokens = () => {
        _setFromToken(toToken)
        _setToToken(fromToken)
        _setFromValue(toValue)
        _setToValue(fromValue)
    }

    const getAmountOut = async (value, tokenIn, tokenOut) => {
        const amountsOut = await routerContract.getAmountOut(value, tokenIn, tokenOut)
        return amountsOut
    }

    const setFromValue = async (balance) => {
        try {
            _setFromValue(balance)
            if (!balance) _setToValue(0)
            if (!toToken || !fromToken || !balance) return
            const amountsOut = await getAmountOut(balance, fromToken.address, toToken.address)
            _setToValue(amountsOut)
        } catch (error) {
            _setToValue(0)
            console.log(error)
        }
    }

    const setToValue = async (balance) => {
        try {
            _setToValue(balance)
            if (!balance) _setFromValue(0)
            if (!toToken || !fromToken || !balance) return
            const amountsOut = await getAmountOut(balance, toToken.address, fromToken.address)
            _setFromValue(amountsOut)
        } catch (error) {
            _setFromValue(0)
            console.log(error)
        }
    }

    const maxFrom = () => setFromValue(fromBalance)
    const maxTo = () => setToValue(toBalance)

    const openModal = (modalType: 'from' | 'to') => {
        setShowSelectTokenModal(true)
        setSelectingToken(modalType)
    }

    const inEth = (value: number, decimals: number) =>
        Number(
            new BN(value)
                .div(new BN(10).pow(new BN(decimals)))
                .toNumber()
                .toFixed(2)
        )

    const formatter = (value: number) => {
        const number = Number(Number(value).toFixed(2))
        return number < 1000 ? commaNumber(number) : shortNumber(number)
    }

    useEffect(() => {
        if (!tokens) return
        const findFromToken =
            tokens.find((token) => token.id === fromTokenUrlParam) ||
            tokens.find((token) => token.id === fromTokenCache)
        const findToToken =
            tokens.find((token) => token.id === toTokenUrlParam) ||
            tokens.find((token) => token.id === toTokenCache)
        if (findFromToken) setFromToken(findFromToken)
        if (findToToken) setToToken(findToToken)
    }, [fromTokenCache, toTokenCache, fromTokenUrlParam, toTokenUrlParam, tokens])

    // useEffect(() => {
    //     if (!fromToken || !toToken) return
    //     if (!router.asPath.startsWith('/singularity')) return

    //     router.replace(`/singularity`, `/singularity?from=${fromToken.id}&to=${toToken.id}`, {
    //         shallow: true
    //     })
    // }, [fromToken, toToken])

    // Load selected token balances.
    useEffect(() => {
        if (!account) return
        if (!fromToken || !toToken) return

        const getFromBalance = async () => {
            if (!fromToken) return
            const fromTokenContract = getTokenContract(fromToken.address)
            const fromTokenBalance = await fromTokenContract.balanceOf(account)
            setFromBalance(fromTokenBalance)
        }

        const getToBalance = async () => {
            if (!toToken) return
            const toTokenContract = getTokenContract(toToken.address)
            const toTokenBalance = await toTokenContract.balanceOf(account)
            setToBalance(toTokenBalance)
        }
        getFromBalance()
        getToBalance()
    }, [account, fromToken, toToken])

    const swap = async () => {
        try {
            if (Number(fromToken.allowBalance) < Number(fromValue)) {
                const fromTokenContract = getTokenContract(fromToken.address, library.getSigner())
                await fromTokenContract.approve(
                    data.safe.router,
                    toWei(String(fromValue), fromToken.decimals)
                )
            }
            const amountIn = fromValue
            const amountOut = await getAmountOut(amountIn, fromToken.address, toToken.address)
            const to = account
            const timestamp = Date.now() + 1000 * 60 * 10
            console.log(fromToken.address, toToken.address, amountIn, amountOut, to, timestamp)
            await routerContract.swapExactTokensForTokens(
                fromToken.address,
                toToken.address,
                amountIn,
                amountOut,
                to,
                timestamp
            )
        } catch (error) {
            console.log(error)
        }
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
            ..._lpBalance,
            ..._walletBalance,
            assetAmount: toEth(_assetAmount, _token.decimals),
            liabilityAmount: toEth(_liabilityAmount, _token.decimals),
            pricePerShare: String(_pricePerShare),
            tradingFeeRate: String(_tradingFeeRate),
            _lpUnderlyingBalance: toEth(_lpUnderlyingBalance, _token.decimals),
            tokenPrice: toEth(_tokenPrice),
            lastUpdated: String(_lastUpdated)
        }
    }

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
        // const interval = setInterval(fetchData, 3000)
        // return () => clearInterval(interval)
    }, [account, slowRefresh, refresh])

    const depositLp = () => {}
    const withdrawLp = () => {}

    return {
        data,
        update,
        lpInput,
        setLpInput,
        selectedLp,
        setSelectedLp,
        refreshing,
        tokens,
        openModal,
        showSelectTokenModal,
        setShowSelectTokenModal,
        selectingToken,
        setSelectingToken,
        fromToken,
        setFromToken,
        toToken,
        setToToken,
        fromValue,
        setFromValue,
        toValue,
        setToValue,
        slippage,
        setSlippage,
        swapTokens,
        fromBalance,
        toBalance,
        fromBalanceEth,
        toBalanceEth,
        maxFrom,
        maxTo,
        inEth,
        formatter,
        totalFees,
        minimumReceived,
        swap
    }
}

export default function useSingularity() {
    return useContext(SingularityContext)
}
