import BN from 'bignumber.js'
import commaNumber from 'comma-number'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import shortNumber from 'short-number'
import { useCookieState } from 'use-cookie-state'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { erc20, routerAbi } from '../../data/abis'
import { TOKENS } from '../../data/constants'

export const SingularityIndexPageContext = createContext({})

export function SingularityAppWrapper({ children }) {
    const router = useRouter()

    const wallet = useWallet()

    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromValue, _setFromValue] = useState(0.0)
    const [toValue, _setToValue] = useState(0.0)
    const [fromToken, _setFromToken] = useState(TOKENS[250][0])
    const [toToken, _setToToken] = useState(TOKENS[250][1])
    const [fromTokenCache, setFromTokenCache] = useCookieState('singularity-from-token', fromToken.id)
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

    const fromBalanceEth = fromToken ? new BN(fromBalance).div(new BN(10).pow(new BN(fromToken.decimals))).toNumber() : 0
    const toBalanceEth = toToken ? new BN(toBalance).div(new BN(10).pow(new BN(toToken.decimals))).toNumber() : 0

    const web3 = new Web3(wallet.account ? wallet.ethereum : process.env.NEXT_PUBLIC_RPC)
    const routerContract = new web3.eth.Contract(routerAbi as any, process.env.NEXT_PUBLIC_ROUTER_CONTRACT)

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

    const getAmountsOut = async (value, path) => {
        const amountsOut = await routerContract.methods.getAmountsOut(value, path).call()
        return amountsOut[amountsOut.length - 1]
    }

    const setFromValue = async (balance) => {
        try {
            _setFromValue(balance)
            if (!toToken || !fromToken || !balance) return
            const amountsOut = await getAmountsOut(balance, [fromToken.address, toToken.address])
            _setToValue(amountsOut)
        } catch (error) {
            _setToValue(0)
            console.log(error)
        }
    }

    const setToValue = async (balance) => {
        try {
            _setToValue(balance)
            if (!toToken || !fromToken || !balance) return
            const amountsOut = await getAmountsOut(balance, [toToken.address, fromToken.address])
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

    // Load selected token balances.
    useEffect(() => {
        if (!wallet.account) return

        const getFromBalance = async () => {
            if (!fromToken) return
            const fromTokenContract = new web3.eth.Contract(erc20, fromToken.address)
            const fromTokenBalance = await fromTokenContract.methods.balanceOf(wallet.account).call()
            setFromBalance(fromTokenBalance)
        }

        const getToBalance = async () => {
            if (!toToken) return
            const toTokenContract = new web3.eth.Contract(erc20, toToken.address)
            const toTokenBalance = await toTokenContract.methods.balanceOf(wallet.account).call()
            setToBalance(toTokenBalance)
        }
        getFromBalance()
        getToBalance()
    }, [wallet, fromToken, toToken])

    // Use router to set tokens.
    useEffect(() => {
        if (!router || !router.query) return
        const fromTokenQuery = TOKENS[250].find((token) => token.id === router.query.from)
        if (fromTokenQuery) setFromToken(fromTokenQuery)
        const toTokenQuery = TOKENS[250].find((token) => token.id === router.query.to)
        if (toTokenQuery) setToToken(toTokenQuery)
    }, [router])

    // Use cache to set tokens.
    useEffect(() => {
        if (!router) return
        if (!fromTokenCache || !toTokenCache) return
        if (router.query.from || router.query.to) return

        const fromTokenQuery = TOKENS[250].find((token) => token.id === fromTokenCache)
        if (fromTokenQuery) setFromToken(fromTokenQuery)
        const toTokenQuery = TOKENS[250].find((token) => token.id === toTokenCache)
        if (toTokenQuery) setToToken(toTokenQuery)
    }, [router])

    // Shallow routing for shareable links.
    useEffect(() => {
        if (fromToken || toToken) router.push(`/singularity`, `/singularity?from=${fromToken ? fromToken.id : 'wftm'}&to=${toToken ? toToken.id : 'wftm'}`, { shallow: true })
    }, [fromToken, toToken])

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
                minimumReceived
            }}
        >
            {children}
        </SingularityIndexPageContext.Provider>
    )
}

const useSingularityData = () => {
    return useContext(SingularityIndexPageContext)
}

export default useSingularityData
