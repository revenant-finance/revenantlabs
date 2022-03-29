import commaNumber from 'comma-number'
import { BigNumber } from 'ethers'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import shortNumber from 'short-number'
import { useCookieState } from 'use-cookie-state'
import * as constants from '../data'
import { EMPTY_ADDRESS, MAX_UINT256, toEth, toWei } from '../utils'
import {
    fetchBalances,
    getSingOracleContract,
    getSingRouterContract,
    getTokenContract
} from '../utils/ContractService'
import multicall from '../utils/multicall'
import { useActiveWeb3React } from './'
import useRefresh from './useRefresh'

const lpTokenABI = JSON.parse(constants.CONTRACT_SING_LP_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_ERC20_TOKEN_ABI)

export const SingularityContext = createContext({})

export function useSingularityInteral() {
    const router = useRouter()
    const { slowRefresh } = useRefresh()
    const { account, library } = useActiveWeb3React()
    const oracleContract = getSingOracleContract()

    const [selectedLp, setSelectedLp] = useState(null)

    const [data, setData] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromValue, _setFromValue] = useState('')
    const [toValue, _setToValue] = useState('')
    const [fromToken, _setFromToken] = useState()
    const [toToken, _setToToken] = useState()
    const [slippageTolerance, setSlippageTolerance] = useState(0.1)
    const [inFee, setInFee] = useState('0')
    const [outFee, setOutFee] = useState('0')
    const [slippageIn, setSlippageIn] = useState('0')
    const [slippageOut, setSlippageOut] = useState('0')
    const [priceImpact, setPriceImpact] = useState(0)


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

    //set by user

    const tokens = data?.safe?.tokens || []

    const totalFees = (Number(inFee) * fromToken?.tokenPrice) + (Number(outFee) * toToken?.tokenPrice)
    const inverseSlippage = (1 - slippageTolerance) * 100
    const minimumReceived = toValue ? toEth(BigNumber.from(Number(toWei(toValue, toToken?.decimals))).mul(inverseSlippage).div(100), toToken?.decimals) : '0'

    const update = () => setRefresh((i) => i + 1)

    const setFromToken = async (token: any) => {
        _setFromToken(token)
        setFromTokenCache(token.id)
        setFromValue('0')
    }

    const setToToken = (token: any) => {
        _setToToken(token)
        setToTokenCache(token.id)
        setToValue('0')
    }

    const swapTokens = () => {
        _setFromToken(toToken)
        _setToToken(fromToken)
        _setFromValue(toValue)
        _setToValue(fromValue)
    }

    const getAmountOut = async (value, tokenIn, tokenOut) => {
        const routerContract = getSingRouterContract(data.safe.router)
        const amountOut = await routerContract.getAmountOut(value, tokenIn, tokenOut)
        return amountOut
    }

    const setFromValue = async (balance) => {
        try {
            if (!toToken || !fromToken || !balance) return
            _setFromValue(balance)
            const [amountOutData, amountOut1]  = await Promise.all([getAmountOut(toWei(balance, fromToken.decimals), fromToken.address, toToken.address), getAmountOut(toWei("1", fromToken.decimals), fromToken.address, toToken.address)])
            const { amountOut, slippageIn, slippageOut, tradingFeeIn, tradingFeeOut } = amountOutData
            const _toValue = toEth(amountOut, toToken.decimals)
            _setToValue(_toValue)
            setSlippageIn(toEth(slippageIn, fromToken.decimals))
            setSlippageOut(toEth(slippageOut, toToken.decimals))
            setInFee(toEth(tradingFeeIn, fromToken.decimals))
            setOutFee(toEth(tradingFeeOut, toToken.decimals))
            const normalizedPrice = (Number(_toValue) / balance)
            const _priceImpact = (normalizedPrice * 100 / Number(toEth(amountOut1.amountOut, toToken.decimals))) - 100
            setPriceImpact(_priceImpact)
        } catch (error) {
            _setToValue('')
            console.log(error)
        }
    }

    const setToValue = async (balance) => {
        try {
            if (!toToken || !fromToken || !balance) return
            _setToValue(balance)
            // const { amountOut, slippageIn, slippageOut, tradingFeeIn, tradingFeeOut } = await getAmountOut(toWei(balance, toToken.decimals), toToken.address, fromToken.address)
            // _setFromValue(toEth(amountOut, fromToken.decimals))
            // setSlippageIn(toEth(slippageIn, fromToken.decimals))
            // setSlippageOut(toEth(slippageOut, toToken.decimals))
            // setInFee(toEth(tradingFeeIn, fromToken.decimals))
            // setOutFee(toEth(tradingFeeOut, toToken.decimals))
        } catch (error) {
            _setFromValue('')
            console.log(error)
        }
    }

    const maxFrom = () => setFromValue(fromToken.walletBalance)
    const maxTo = () => setToValue(toToken.walletBalance)

    const openModal = (modalType: 'from' | 'to') => {
        setShowSelectTokenModal(true)
        setSelectingToken(modalType)
    }

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

    const swap = async () => {
        try {
            if (Number(fromToken?.allowBalance) < Number(fromValue)) {
                const fromTokenContract = getTokenContract(fromToken.address, library.getSigner())
                await fromTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(fromValue, fromToken.decimals)
                )
            }
            const routerContract = getSingRouterContract(data.safe.router, library.getSigner())
            const amountIn = toWei(fromValue, fromToken.decimals)
            const to = account
            const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
            await routerContract.swapExactTokensForTokens(
                fromToken.address,
                toToken.address,
                amountIn,
                toWei(minimumReceived, toToken.decimals),
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
            lpBalance: _lpBalance,
            ..._walletBalance,
            assetAmount: toEth(_assetAmount, _token.decimals),
            liabilityAmount: toEth(_liabilityAmount, _token.decimals),
            pricePerShare: toEth(_pricePerShare),
            tradingFeeRate: String(_tradingFeeRate),
            lpUnderlyingBalance: toEth(_lpUnderlyingBalance, _token.decimals),
            tokenPrice: toEth(_tokenPrice),
            lastUpdated: String(_lastUpdated),
            collatRatio: Number(_liabilityAmount) ? String(Number(_assetAmount.mul(1000).div(_liabilityAmount)) / 1000) : '0'
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
    }, [account, slowRefresh, refresh])



    return {
        data,
        update,
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
        slippageTolerance,
        setSlippageTolerance,
        swapTokens,
        maxFrom,
        maxTo,
        formatter,
        totalFees,
        minimumReceived,
        swap,
        priceImpact
    }
}

export default function useSingularity() {
    return useContext<any>(SingularityContext)
}
