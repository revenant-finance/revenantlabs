import BN from 'bignumber.js'
import commaNumber from 'comma-number'
import { useRouter } from 'next/router'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import shortNumber from 'short-number'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { erc20, routerAbi } from '../../data/abis'
import { TOKENS } from '../../data/constants'
import { useCookieState } from 'use-cookie-state'

export const SingularityIndexPageContext = createContext({})

export function SingularityAppWrapper({ children }) {
    const router = useRouter()

    const wallet = useWallet()

    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromValue, _setFromValue] = useState(0.0)
    const [toValue, _setToValue] = useState(0.0)
    const [fromToken, _setFromToken] = useCookieState('singularity-from-token', TOKENS[250][0])
    const [toToken, _setToToken] = useCookieState('singularity-to-token', TOKENS[250][1])
    const [slippage, setSlippage] = useState(0.1)
    const [fromBalance, setFromBalance] = useState(0)
    const [toBalance, setToBalance] = useState(0)

    const fromBalanceEth = fromToken ? new BN(fromBalance).div(new BN(10).pow(new BN(fromToken.decimals))).toNumber() : 0
    const toBalanceEth = toToken ? new BN(toBalance).div(new BN(10).pow(new BN(toToken.decimals))).toNumber() : 0

    const web3 = new Web3(wallet.account ? wallet.ethereum : process.env.NEXT_PUBLIC_RPC)
    const routerContract = new web3.eth.Contract(routerAbi as any, process.env.NEXT_PUBLIC_ROUTER_CONTRACT)

    const setFromToken = async (token: any) => {
        _setFromToken(token)
        setFromValue(0)
    }

    const setToToken = (token: any) => {
        _setToToken(token)
        setToValue(0)
    }

    const swapTokens = () => {
        setFromToken(toToken)
        setToToken(fromToken)
        _setFromValue(toValue)
        _setToValue(fromValue)
    }

    const getAmountsOut = async (value, path) => {
        const amountsOut = await routerContract.methods.getAmountsOut(value, path).call()
        return amountsOut[amountsOut.length - 1]
    }

    // useEffect(() => {
    //     if (!fromValue) return

    //     const onLoad = async () => {
    //         const amountsOut = await getAmountsOut(fromValue, [fromToken.address, toToken.address])
    //         setToValue(amountsOut)
    //     }
    //     onLoad()
    // }, [fromValue])

    // useEffect(() => {
    //     if (!toValue) return

    //     const onLoad = async () => {
    //         const amountsOut = await getAmountsOut(toValue, [toToken.address, fromToken.address])
    //         setFromValue(amountsOut)
    //     }
    //     onLoad()
    // }, [toValue])

    const setFromValue = async (balance) => {
        try {
            _setFromValue(balance)
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
            console.log('toTokenBalance', toTokenBalance)
            setToBalance(toTokenBalance)
        }
        getFromBalance()
        getToBalance()
    }, [wallet, fromToken, toToken])

    // Use router to set tokens.
    useEffect(() => {
        if (!router.query) return
        const fromTokenQuery = TOKENS[250].find((token) => token.id === router.query.from)
        if (fromTokenQuery) setFromToken(fromTokenQuery)
        const toTokenQuery = TOKENS[250].find((token) => token.id === router.query.to)
        if (toTokenQuery) setToToken(toTokenQuery)
    }, [router])

    // Shallow routing for shareable links.
    useEffect(() => {
        router.push(`/singularity`, `/singularity?from=${fromToken.id}&to=${toToken.id}`, { shallow: true })
    }, [fromToken, toToken])

    // Fix if broken.
    useEffect(() => {
        if (fromToken && !fromToken.id) setFromToken(TOKENS[250][0])
    }, [fromToken])
    useEffect(() => {
        if (toToken && !toToken.id) setToToken(TOKENS[250][1])
    }, [toToken])

    // Updated `to` price with updated `from` price every 2 seconds.
    // useEffect(() => {
    //     const priceTimer = setInterval(() => {
    //         setFromValue(fromValue)
    //     }, 4000)
    //     return () => clearInterval(priceTimer)
    // }, [fromValue])

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
                formatter
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
