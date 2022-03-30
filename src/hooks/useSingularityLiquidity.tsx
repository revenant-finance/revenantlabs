import { useContext, createContext, useState } from 'react'
import { toWei } from 'web3-utils'
import { useActiveWeb3React } from '.'
import { useSingularityData } from '../components/Singularity/SingularityAppWrapper'
import { MAX_UINT256, toEth } from '../utils'
import {
    getSingLpContract,
    getSingRouterContract,
    getTokenContract
} from '../utils/ContractService'

export function useSingularityLiquidityInternal() {
    const { account, library } = useActiveWeb3React()

    const { data } = useSingularityData()

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
            if (Number(token?.allowBalance) < Number(amountIn)) {
                const depositTokenContract = getTokenContract(token.address, library.getSigner())
                await depositTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(amountIn, token.decimals)
                )
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
            await routerContract.addLiquidity(
                token.address,
                formatAmountIn,
                toWei(String(minAmount), token.decimals),
                to,
                timestamp
            )
        } catch (error) {
            console.log(error)
        }
    }

    const withdrawLp = async (amountIn, token) => {
        try {
            if (Number(token?.lpBalance.allowBalance) < Number(amountIn)) {
                const fromTokenContract = getTokenContract(token.lpAddress, library.getSigner())
                await fromTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(amountIn)
                )
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
            await routerContract.removeLiquidity(
                token.address,
                formatAmountIn,
                minAmount,
                to,
                timestamp
            )
        } catch (error) {
            console.log(error)
        }
    }

    return {
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
        depositLp
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
