import commaNumber from 'comma-number'
import { BigNumber } from 'ethers'
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

    const tokens = data?.safe?.tokens || []

    const totalFees = Number(inFee) * fromToken?.tokenPrice + Number(outFee) * toToken?.tokenPrice
    const inverseSlippage = (1 - slippageTolerance) * 100
    const minimumReceived = toValue
        ? toEth(toWei(toValue, toToken?.decimals).mul(inverseSlippage).div(100), toToken?.decimals)
        : '0'

    const setFromToken = async (token: any) => {
        _setFromToken(token)
        setFromTokenCache(token.id)
        setFromValue('')
    }

    const setToToken = (token: any) => {
        _setToToken(token)
        setToTokenCache(token.id)
        setToValue('')
    }

    const swapTokens = () => {
        _setFromToken(toToken)
        _setToToken(fromToken)
        // _setFromValue(toValue)
        _setToValue(fromValue)
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
            setSlippageIn(toEth(slippageIn, fromToken.decimals))
            setSlippageOut(toEth(slippageOut, toToken.decimals))
            setInFee(toEth(tradingFeeIn, fromToken.decimals))
            setOutFee(toEth(tradingFeeOut, toToken.decimals))
            const normalizedPrice = Number(_toValue) / balance
            const _priceImpact =
                (normalizedPrice * 100) / Number(toEth(amountOut1.amountOut, toToken.decimals)) -
                100
            setPriceImpact(_priceImpact)
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

    useEffect(() => {
        if (!fromToken || !toToken) return
        if (!router.asPath.startsWith('/singularity')) return

        router.replace(`/singularity`, `/singularity?from=${fromToken.id}&to=${toToken.id}`, {
            shallow: true
        })
    }, [fromToken, toToken])

    // Load selected token balances.

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
