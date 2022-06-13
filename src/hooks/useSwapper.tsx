import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCookieState } from 'use-cookie-state'
import { MAX_UINT256, toEth, toWei } from '../utils'
import { getRouterContract, getTokenContract } from '../utils/ContractService'
import { useActiveWeb3React } from '.'
import { useData } from '../components/AppWrapper'
import useAlerts from './useAlerts'

export function useSwapperInternal() {
    const router = useRouter()
    const { account, library } = useActiveWeb3React()

    const { newAlert } = useAlerts()
    const { data, update } = useData()

    const [statusMessage, setStatusMessage] = useState('')
    const [status, setStatus] = useState('idle')
    const [showDetails, setShowDetails] = useState(false)
    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromValue, _setFromValue] = useState('')
    const [toValue, _setToValue] = useState('')
    const [_fromTokenId, _setFromTokenId] = useState()
    const [_toTokenId, _setToTokenId] = useState()
    const [slippageTolerance, _setSlippageTolerance] = useState(0.01)
    const [inFee, setInFee] = useState('0')
    const [outFee, setOutFee] = useState('0')
    const [slippageIn, setSlippageIn] = useState('0')
    const [slippageOut, setSlippageOut] = useState('0')
    const [priceImpact, setPriceImpact] = useState(0)
    const [totalFees, setTotalFees] = useState(0)
    const [minimumReceived, setMinimumReceived] = useState('0')

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

    const tokens = data?.safe?.tokens || []

    const fromToken = tokens?.find((token) => token.id === _fromTokenId)
    const toToken = tokens?.find((token) => token.id === _toTokenId)

    useEffect(() => {
        setFromValue(fromValue)
    }, [toToken, fromToken])

    const setFromToken = async (token: any) => {
        _setFromTokenId(token.id)
        setFromTokenCache(token.id)
    }

    const setToToken = (token: any) => {
        _setToTokenId(token.id)
        setToTokenCache(token.id)
    }

    const swapTokens = () => {
        setFromToken(toToken)
        setToToken(fromToken)
        _setFromValue(toValue)
    }

    const addToken = (token) => {
        library.provider.sendAsync(
            {
                method: 'metamask_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: token.address,
                        symbol: token.symbol.slice(0, 6),
                        decimals: token.decimals
                    }
                },
                id: Math.round(Math.random() * 100000)
            },
            (err, added) => {
                return
            }
        )
    }

    const setSlippageTolerance = (tolerance) => {
        const inverseSlippage = ((1 - slippageTolerance) * 100).toFixed(0)
        const _minimumReceived = toEth(
            toWei(toValue, toToken.decimals).mul(inverseSlippage).div(100),
            toToken.decimals
        )
        setMinimumReceived(_minimumReceived)
        _setSlippageTolerance(tolerance)
    }

    const getAmountOut = async (value, tokenIn, tokenOut) => {
        const routerContract = getRouterContract(data.safe.router)
        try {
            const amountOut = await routerContract.getAmountOut(value, tokenIn, tokenOut)
            return amountOut
        } catch (error) {
            return null
        }
    }

    const setFromValue = async (balance) => {
        try {
            if (!balance) {
                _setFromValue('')
                _setToValue('')
                return
            }
            _setFromValue(balance)
            const [amountOutData, amountOut1] = await Promise.all([
                getAmountOut(
                    toWei(balance, fromToken.decimals),
                    fromToken.address,
                    toToken.address
                ),
                getAmountOut(toWei('1', fromToken.decimals), fromToken.address, toToken.address)
            ])
            if (!amountOutData || !amountOut1) {
                _setToValue('0')
                return
            }
            const { amountOut, slippageIn, slippageOut, tradingFeeIn, tradingFeeOut } =
                amountOutData
            const _toValue = toEth(amountOut, toToken.decimals)
            _setToValue(_toValue)
            const _slippageIn = toEth(slippageIn, fromToken.decimals)
            setSlippageIn(_slippageIn)
            const _slippageOut = toEth(slippageOut, toToken.decimals)
            setSlippageOut(_slippageOut)
            const _inFee = toEth(tradingFeeIn, fromToken.decimals)
            setInFee(_inFee)
            const _outFee = toEth(tradingFeeOut, toToken.decimals)
            setOutFee(_outFee)
            const normalizedPrice = Number(_toValue) / balance
            const _priceImpact =
                (normalizedPrice * 100) / Number(toEth(amountOut1.amountOut, toToken.decimals)) -
                100
            setPriceImpact(Math.abs(_priceImpact))
            const _totalFees =
                Number(_inFee) * fromToken?.tokenPrice + Number(_outFee) * toToken?.tokenPrice
            setTotalFees(_totalFees)
            const inverseSlippage = ((1 - slippageTolerance) * 100).toFixed(0)
            const _minimumReceived = toEth(
                amountOut.mul(inverseSlippage).div(100),
                toToken.decimals
            )
            setMinimumReceived(_minimumReceived)
        } catch (error) {
            _setFromValue('')
            _setToValue('')
            console.log(error)
        }
    }

    const setToValue = async (balance) => {
        try {
            if (!toToken || !fromToken || !balance) return
            _setToValue(balance)
        } catch (error) {
            // _setFromValue('')
            console.log(error)
        }
    }

    const maxFrom = () => setFromValue(fromToken.walletBalance)
    const maxTo = () => setToValue(toToken.walletBalance)

    const openModal = (modalType: 'from' | 'to') => {
        setShowSelectTokenModal(true)
        setSelectingToken(modalType)
    }

    const isApproved = Number(fromToken?.allowBalance) >= Number(fromValue)

    const swap = async () => {
        try {
            setStatus('loading')
            if (Number(fromToken?.allowBalance) < Number(fromValue)) {
                const fromTokenContract = getTokenContract(fromToken.address, library.getSigner())
                const tx = await fromTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(fromValue, fromToken.decimals)
                )
                await tx.wait(1)
                newAlert({
                    title: 'Approval Complete',
                    subtitle: 'Your transaction has been successfully confirmed to the network.',
                    type: 'success'
                })
                setStatus('complete')
                await update()
                return
            }
            const routerContract = getRouterContract(data.safe.router, library.getSigner())
            const amountIn = toWei(fromValue, fromToken.decimals)
            const to = account
            const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
            const tx = await routerContract.swapExactTokensForTokens(
                fromToken.address,
                toToken.address,
                amountIn,
                toWei(minimumReceived, toToken.decimals),
                to,
                timestamp
            )
            await tx.wait(1)
            setStatus('complete')
            newAlert({
                title: 'Swap Complete',
                subtitle: 'Your transaction has been successfully confirmed to the network.',
                type: 'success'
            })
            setFromValue('')
            setToValue('')
            await update()
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            newAlert({
                title: 'Swap Failed',
                subtitle: 'Your transaction has not been completed.',
                type: 'fail'
            })
            console.log(error)
        }
    }

    // Grabs a token from either URL or cache. URL takes precedence.
    useEffect(() => {
        if (!tokens) return
        if (fromToken) return
        if (toToken) return

        const findFromToken =
            tokens.find((token) => token.id === fromTokenUrlParam) ||
            tokens.find((token) => token.id === fromTokenCache)
        const findToToken =
            tokens.find((token) => token.id === toTokenUrlParam) ||
            tokens.find((token) => token.id === toTokenCache)
        if (findFromToken) setFromToken(findFromToken)
        if (findToToken) setToToken(findToToken)
    }, [fromTokenCache, toTokenCache, fromTokenUrlParam, toTokenUrlParam, tokens])

    // Updates the URL when a new token is selected.
    useEffect(() => {
        if (!fromToken || !toToken) return
        const paths = router.asPath
        const pathSuffix = paths[paths.length - 1]
        if (!pathSuffix.startsWith('/')) return
        const url = new URL(`${window.location}`)
        url.searchParams.set('from', fromToken.id)
        url.searchParams.set('to', toToken.id)
        window.history.replaceState('', '', url.toString())

    }, [fromToken, toToken])

    return {
        status,
        statusMessage,
        showDetails,
        setShowDetails,
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
        totalFees,
        minimumReceived,
        swap,
        priceImpact,
        isApproved,
        inFee,
        outFee,
        slippageIn,
        slippageOut,
        addToken
    }
}

export const SwapperContext = createContext({})

export function SwapperWrapper({ children }: any) {
    const swapper = useSwapperInternal()

    return (
        <>
            <SwapperContext.Provider value={{ ...swapper }}>
                <>{children}</>
            </SwapperContext.Provider>
        </>
    )
}

export default function useSingularitySwapper() {
    return useContext<any>(SwapperContext)
}