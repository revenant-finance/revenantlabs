import { useContext, createContext, useState } from 'react'
import { useActiveWeb3React } from '.'
import { useSingularityData } from '../components/Singularity/SingularityAppWrapper'
import { MAX_UINT256, toEth, toWei } from '../utils'
import {
    getSingLpContract,
    getSingRouterContract,
    getTokenContract,
    getTestTokenContract
} from '../utils/ContractService'

export function useSingularityLiquidityInternal() {
    const { account, library } = useActiveWeb3React()

    const { data, update } = useSingularityData()

    const [statusMessage, setStatusMessage] = useState('')
    const [status, setStatus] = useState('idle')

    const [lpInput, _setLpInput] = useState('')
    const [isWithdraw, setIsWithdraw] = useState(false)
    const [selectedLp, setSelectedLp] = useState(null)

    const [slippageTolerance, setSlippageTolerance] = useState(0.1)
    const [withdrawFee, setWithdrawFee] = useState('0')
    const [depositReward, setDepositReward] = useState('0')

    const routerContract =
        data?.safe && getSingRouterContract(data.safe.router, account ? library.getSigner() : null)

    const inverseSlippage = (1 - slippageTolerance) * 100

    const setLpInput = async (input) => {
        _setLpInput(input)
        const lpContract = getSingLpContract(selectedLp.lpAddress)
        const formattedLpInput = toWei(input ? input : '0', selectedLp.decimals)
        const [_withdrawFee, _depositReward] = await Promise.all([
            lpContract.getWithdrawFee(formattedLpInput),
            lpContract.getDepositFee(formattedLpInput)
        ])
        setWithdrawFee(toEth(_withdrawFee, selectedLp.decimals))
        setDepositReward(toEth(_depositReward, selectedLp.decimals))
    }

    const depositLp = async (amountIn, token) => {
        try {
            setStatus('loading')
            if (Number(token?.allowBalance) < Number(amountIn)) {
                const depositTokenContract = getTokenContract(token.address, library.getSigner())
                const tx = await depositTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(amountIn, token.decimals)
                )
                await tx.wait(1)
                await update()
            }
            const to = account
            const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
            const formatAmountIn = toWei(amountIn, token.decimals)
            const formatPricePerShare = toWei(
                Number(token.pricePerShare).toFixed(token.decimals),
                token.decimals
            )
            const minAmount = formatAmountIn
                .mul(100)
                .mul(inverseSlippage)
                .div(formatPricePerShare)
                .div(10000)
            const tx = await routerContract.addLiquidity(
                token.address,
                formatAmountIn,
                toWei(String(minAmount), token.decimals),
                to,
                timestamp
            )
            await tx.wait(1)
            await update()
            setStatus('complete')
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            console.log(error)
        }
    }

    const withdrawLp = async (amountIn, token) => {
        try {
            setStatus('loading')
            if (Number(token?.lpBalance.allowBalance) < Number(amountIn)) {
                const fromTokenContract = getTokenContract(token.lpAddress, library.getSigner())
                const tx = await fromTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(amountIn)
                )
                await tx.wait(1)
            }
            const to = account
            const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
            const formatAmountIn = toWei(amountIn, token.decimals)
            const formatPricePerShare = toWei(
                Number(token.pricePerShare).toFixed(token.decimals),
                token.decimals
            )
            const minAmount = Number(
                toEth(
                    formatAmountIn
                        .mul(100)
                        .mul(inverseSlippage)
                        .mul(formatPricePerShare)
                        .div(10000),
                    token.decimals
                )
            ).toFixed(0)
            const tx = await routerContract.removeLiquidity(
                token.address,
                formatAmountIn,
                minAmount,
                to,
                timestamp
            )
            await tx.wait(1)
            await update()
            setStatus('complete')
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            console.log(error)
        }
    }

    const mintTestToken = async (token, amount = '1000') => {
        try {
            setStatus('idle')
            const fromTokenContract = getTestTokenContract(token.address, library.getSigner())
            await fromTokenContract.mint(account, toWei(amount, token.decimals))
            setStatus('complete')
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            console.log(error)
        }
    }

    return {
        status,
        statusMessage,
        selectedLp,
        setSelectedLp,
        lpInput,
        setLpInput,
        isWithdraw,
        setIsWithdraw,
        slippageTolerance,
        setSlippageTolerance,
        withdrawFee,
        setWithdrawFee,
        depositReward,
        setDepositReward,
        withdrawLp,
        depositLp,
        mintTestToken
    }
}

export const SingularityLiquidityContext = createContext({})

export function SingularityLiquidityWrapper({ children }: any) {
    const Liquidity = useSingularityLiquidityInternal()

    return (
        <>
            <SingularityLiquidityContext.Provider value={{ ...Liquidity }}>
                <>{children}</>
            </SingularityLiquidityContext.Provider>
        </>
    )
}

export default function useSingularityLiquidity() {
    return useContext<any>(SingularityLiquidityContext)
}
