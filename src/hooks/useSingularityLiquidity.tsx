import { useContext, createContext, useState, useEffect } from 'react'
import { useActiveWeb3React } from '.'
import { useSingularityData } from '../components/Singularity/SingularityAppWrapper'
import { MAX_UINT256, toEth, toWei } from '../utils'
import {
    getSingLpContract,
    getSingRouterContract,
    getTokenContract,
    getTestTokenContract
} from '../utils/ContractService'
import useAlerts from './useAlerts'

export function useSingularityLiquidityInternal() {
    const { account, library } = useActiveWeb3React()

    const { newAlert } = useAlerts()
    const { tokens, data, update } = useSingularityData()

    const [statusMessage, setStatusMessage] = useState('')
    const [status, setStatus] = useState('idle')

    const [lpInput, _setLpInput] = useState('')
    const [isWithdraw, setIsWithdraw] = useState(false)
    const [_selectedLp, setSelectedLp] = useState(null)

    const selectedLp = tokens?.find((token) => token.id == _selectedLp)

    const [slippageTolerance, setSlippageTolerance] = useState(0.1)
    const [withdrawFee, setWithdrawFee] = useState('0')
    const [depositReward, setDepositReward] = useState('0')

    const routerContract =
        data?.safe && getSingRouterContract(data.safe.router, account ? library.getSigner() : null)

    const inverseSlippage = (1 - slippageTolerance) * 100

    console.log(selectedLp)
    const isUnderlyingApproved = Number(selectedLp?.allowBalance) >= Number(lpInput)
    const isLpApproved = Number(selectedLp?.lpBalance.allowBalance) >= Number(lpInput)


    const lpToUnderlying = (amount, pool) => {
        const underlyingAmount = amount * pool?.pricePerShare
        return underlyingAmount
    }

    const underlyingToLp = (amount, pool) => {
        const lpAmount = String(toWei(amount, pool.decimals).div(toWei(pool.pricePerShare, pool.decimals)))
        return lpAmount
    }

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
                update()
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
                '0',
                // toWei(String(minAmount), token.decimals),
                to,
                timestamp
            )
            await tx.wait(1)
            await update()
            setStatus('complete')
            newAlert({
                title: 'Deposit Complete',
                subtitle: 'Your transaction has been successfully confirmed to the network.',
                type: 'success'
            })
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            newAlert({
                title: 'Deposit Failed',
                subtitle: 'Your transaction has not been completed.',
                type: 'fail'
            })
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
                update()
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
                '0',
                // minAmount,
                to,
                timestamp
            )
            await tx.wait(1)
            await update()
            setStatus('complete')
            newAlert({
                title: 'Withdraw Complete',
                subtitle: 'Your transaction has been successfully confirmed to the network.',
                type: 'success'
            })
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            newAlert({
                title: 'Withdraw Failed',
                subtitle: 'Your transaction has not been completed.',
                type: 'fail'
            })
            console.log(error)
        }
    }

    const mintTestToken = async (token, amount = '1000') => {
        try {
            setStatus('idle')
            const fromTokenContract = getTestTokenContract(token.address, library.getSigner())
            const tx = await fromTokenContract.mint(account, toWei(amount, token.decimals))
            await tx.wait(1)
            await update()
            setStatus('complete')
            newAlert({
                title: 'Minting Complete',
                subtitle: 'Your transaction has been successfully confirmed to the network.',
                type: 'success'
            })
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            newAlert({
                title: 'Minting Failed',
                subtitle: 'Your transaction has not been completed.',
                type: 'fail'
            })
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
        isUnderlyingApproved,
        isLpApproved,
        setIsWithdraw,
        slippageTolerance,
        setSlippageTolerance,
        withdrawFee,
        setWithdrawFee,
        depositReward,
        setDepositReward,
        withdrawLp,
        depositLp,
        mintTestToken,
        lpToUnderlying,
        underlyingToLp
    }
}

export const SingularityLiquidityContext = createContext({})

export function SingularityLiquidityWrapper({ children }: any) {
    const hook = useSingularityLiquidityInternal()

    return (
        <>
            <SingularityLiquidityContext.Provider value={{ ...hook }}>
                <>{children}</>
            </SingularityLiquidityContext.Provider>
        </>
    )
}

export default function useSingularityLiquidity() {
    return useContext<any>(SingularityLiquidityContext)
}
