import commaNumber from 'comma-number'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import shortNumber from 'short-number'
import { useCookieState } from 'use-cookie-state'
import { MAX_UINT256, toEth, toWei } from '../utils'
import { getSingRouterContract, getTokenContract } from '../utils/ContractService'
import { useActiveWeb3React } from './'
import { useSingularityData } from '../components/Singularity/SingularityAppWrapper'
import useAlerts from './useAlerts'

export function useSingularitySwapperInternal() {
    const router = useRouter()
    const { account, library } = useActiveWeb3React()

    const { newAlert } = useAlerts()
    const { data, update } = useSingularityData()

    const [statusMessage, setStatusMessage] = useState('')
    const [status, setStatus] = useState('idle')
    const [showDetails, setShowDetails] = useState(false)
    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromValue, _setFromValue] = useState('')
    const [toValue, _setToValue] = useState('')
    const [_fromTokenId, _setFromTokenId] = useState()
    const [_toTokenId, _setToTokenId] = useState()
    const [slippageTolerance, setSlippageTolerance] = useState(0.1)
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

    useEffect(() => {
        setFromValue(fromValue)
    }, [toToken, fromToken])

    const fromToken = tokens?.find((token) => token.id === _fromTokenId)
    const toToken = tokens?.find((token) => token.id === _toTokenId)

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

    const getAmountOut = async (value, tokenIn, tokenOut) => {
        const routerContract = getSingRouterContract(data.safe.router)
        const amountOut = await routerContract.getAmountOut(value, tokenIn, tokenOut)
        return amountOut
    }

    const setFromValue = async (balance) => {
        try {
            _setFromValue(balance)
            const [amountOutData, amountOut1] = await Promise.all([
                getAmountOut(
                    toWei(balance, fromToken.decimals),
                    fromToken.address,
                    toToken.address
                ),
                getAmountOut(toWei('1', fromToken.decimals), fromToken.address, toToken.address)
            ])
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
            setPriceImpact(_priceImpact)
            const _totalFees =
                Number(_inFee) * fromToken?.tokenPrice + Number(_outFee) * toToken?.tokenPrice
            setTotalFees(_totalFees)
            const inverseSlippage = 1 - slippageTolerance
            const _minimumReceived = String(Number(_toValue) * inverseSlippage)
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
            // const { amountOut, slippageIn, slippageOut, tradingFeeIn, tradingFeeOut } = await getAmountOut(toWei(balance, toToken.decimals), toToken.address, fromToken.address)
            // _setFromValue(toEth(amountOut, fromToken.decimals))
            // setSlippageIn(toEth(slippageIn, fromToken.decimals))
            // setSlippageOut(toEth(slippageOut, toToken.decimals))
            // setInFee(toEth(tradingFeeIn, fromToken.decimals))
            // setOutFee(toEth(tradingFeeOut, toToken.decimals))
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

    const formatter = (value: number) => {
        const number = Number(Number(value).toFixed(2))
        return number < 1000 ? commaNumber(number) : shortNumber(number)
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
                update()
            }
            const routerContract = getSingRouterContract(data.safe.router, library.getSigner())
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
            await update()
            newAlert({
                title: 'Swap Complete',
                subtitle: 'Your transaction has been successfully confirmed to the network.',
                type: 'success'
            })
            setStatus('complete')
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
        const paths = router.asPath.split('/')
        const pathSuffix = paths[paths.length - 1]
        if (!pathSuffix.startsWith('singularity')) return

        const url = new URL(`${window.location}`)
        url.searchParams.set('from', fromToken.id)
        url.searchParams.set('to', toToken.id)
        window.history.replaceState('', '', url.toString())

        // router.replace(`/singularity`, `/singularity?from=${fromToken.id}&to=${toToken.id}`, {
        //     shallow: true
        // })
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
        formatter,
        totalFees,
        minimumReceived,
        swap,
        priceImpact,
        isApproved
    }
}

export const SingularitySwapperContext = createContext({})

export function SingularitySwapperWrapper({ children }: any) {
    const swapper = useSingularitySwapperInternal()

    return (
        <>
            <SingularitySwapperContext.Provider value={{ ...swapper }}>
                <>{children}</>
            </SingularitySwapperContext.Provider>
        </>
    )
}

export default function useSingularitySwapper() {
    return useContext<any>(SingularitySwapperContext)
}
