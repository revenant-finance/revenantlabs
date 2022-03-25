import BN from 'bignumber.js'
import commaNumber from 'comma-number'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import shortNumber from 'short-number'
import { useCookieState } from 'use-cookie-state'
import { useActiveWeb3React } from '../../hooks'
import { getSingRouterContract, getTokenContract } from '../../utils/ContractService'
import NotReadyModal from '../NotReadyModal'
import useSingularityData2 from '../../hooks/Creditum/useSingularity'
import { CONTRACT_SINGULARITY } from '../../data'
import { toEth, toWei } from '../../utils'

export const SingularityIndexPageContext = createContext({})

export function SingularityAppWrapper({ children }) {
    const router = useRouter()

    const { account, library } = useActiveWeb3React()
    const { singularityData } = useSingularityData2()
    if (!Object.values(singularityData).length) return null

    const TOKENS = Object.values(singularityData.safe.tokens)
    console.log(TOKENS)
    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromValue, _setFromValue] = useState(0.0)
    const [toValue, _setToValue] = useState(0.0)
    const [fromToken, _setFromToken] = useState(TOKENS[0])
    const [toToken, _setToToken] = useState(TOKENS[1])

    // URL params `from` and `to`. Matches a token id.
    const [fromTokenUrlParam, setFromTokenUrlParam] = useState()
    const [toTokenUrlParam, setToTokenUrlParam] = useState()
    useEffect(() => setFromTokenUrlParam(router.query.from), [router])
    useEffect(() => setToTokenUrlParam(router.query.to), [router])

    // Cache'd `from` and `to`. Matches a token id.
    const [fromTokenCache, setFromTokenCache] = useCookieState(
        'singularity-from-token',
        fromToken.id
    )
    const [toTokenCache, setToTokenCache] = useCookieState('singularity-to-token', toToken.id)

    const [slippage, setSlippage] = useState(0.1)
    const [fromBalance, setFromBalance] = useState(0)
    const [toBalance, setToBalance] = useState(0)

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

    const routerContract = getSingRouterContract(singularityData.safe.router, library.getSigner())

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

    // const doApprovalCheck = () => {}

    const swap = async () => {
        try {
            if (Number(fromToken.allowBalance) < Number(fromValue)) {
                const fromTokenContract = getTokenContract(fromToken.address, library.getSigner())
                await fromTokenContract.approve(singularityData.safe.router, toWei(String(fromValue), fromToken.decimals))
            }
            const amountIn = fromValue
            const amountOut = await getAmountOut(amountIn, fromToken.address, toToken.address)
            const to = account
            const timestamp = Date.now() + 1000 * 60 * 10
            console.log(fromToken.address, toToken.address, amountIn, amountOut, to, timestamp)
            await routerContract.swapExactTokensForTokens(fromToken.address, toToken.address, amountIn, amountOut, to, timestamp)
        } catch (error) {
            console.log(error)
        }
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
        const findFromToken =
            TOKENS.find((token) => token.id === fromTokenUrlParam) ||
            TOKENS.find((token) => token.id === fromTokenCache)
        const findToToken =
            TOKENS.find((token) => token.id === toTokenUrlParam) ||
            TOKENS.find((token) => token.id === toTokenCache)
        if (findFromToken) setFromToken(findFromToken)
        if (findToToken) setToToken(findToToken)
    }, [fromTokenCache, toTokenCache, fromTokenUrlParam, toTokenUrlParam])

    useEffect(() => {
        router.replace(`/singularity`, `/singularity?from=${fromToken.id}&to=${toToken.id}`, {
            shallow: true
        })
    }, [fromToken, toToken])

    // Load selected token balances.
    useEffect(() => {
        if (!account) return

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

    return (
        <SingularityIndexPageContext.Provider
            value={{
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
            }}
        >
            {/* <NotReadyModal /> */}
            {children}
        </SingularityIndexPageContext.Provider>
    )
}

const useSingularityData = () => {
    return useContext(SingularityIndexPageContext)
}

export default useSingularityData
