import { useContext, createContext, useState, useEffect } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { useSingularityData } from '../SingularityAppWrapper'
import { MAX_UINT256, toEth, toWei, isNotEmpty } from '../../utils'
import {
    getSingLpContract,
    getSingRouterContract,
    getTokenContract,
    getTestTokenContract
} from '../../utils/ContractService'
import useAlerts from '../../hooks/useAlerts'
import { ethers } from 'ethers'

export function useSingularityLiquidityInternal() {
    const { account, library } = useActiveWeb3React()

    const { newAlert } = useAlerts()
    const { tokens, data, update } = useSingularityData()

    const [statusMessage, setStatusMessage] = useState('')
    const [status, setStatus] = useState('idle')

    const [lpInput, _setLpInput] = useState('')
    const [isWithdrawal, setIsWithdrawal] = useState(false)
    const [_selectedLp, setSelectedLp] = useState(null)

    const selectedLp = tokens?.find((token) => token.id == _selectedLp)

    const [slippageTolerance, setSlippageTolerance] = useState(0.1)
    const [withdrawalFee, setWithdrawalFee] = useState('0')
    const [depositFee, setDepositFee] = useState('0')
    const [withdrawalAmount, setWithdrawalAmount] = useState('0')

    const routerContract =
        data?.safe && getSingRouterContract(data.safe.router, account ? library.getSigner() : null)

    const inverseSlippage = (1 - slippageTolerance) * 100

    const isUnderlyingApproved = Number(selectedLp?.allowBalance) >= Number(lpInput)
    const isLpApproved = Number(selectedLp?.lpBalance?.allowBalance) >= Number(lpInput)

    const lpToUnderlying = (amount, pool) => {
        const underlyingAmount = amount * pool?.pricePerShare
        return underlyingAmount
    }

    const underlyingToLp = (amount, pool) => {
        const lpAmount = String(
            toWei(amount, pool.decimals).div(toWei(pool.pricePerShare, pool.decimals))
        )
        return lpAmount
    }

    const getWithdrawInfo = (amountIn, token) => {
        const to = account
        const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
        const formatAmountIn = toWei(amountIn, token.decimals)
        const formatPricePerShare = toWei(
            Number(token.pricePerShare).toFixed(token.decimals),
            token.decimals
        )
        const minAmount = toEth(
            formatAmountIn.mul(inverseSlippage).mul(formatPricePerShare).div(100),
            token.decimals
        )
        return {
            tokenAddress: token.address,
            formatAmountIn,
            minAmount,
            to,
            timestamp
        }
    }

    const getDepositInfo = (amountIn, token) => {
        const to = account
        const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
        const formatAmountIn = toWei(amountIn, token.decimals)
        const formatPricePerShare = toWei(
            Number(token.pricePerShare).toFixed(token.decimals),
            token.decimals
        )
        const minAmount = String(
            toWei(String(formatAmountIn), token.decimals)
                .mul(inverseSlippage)
                .div(formatPricePerShare)
                .div(100)
        )
        return {
            tokenAddress: token.address,
            formatAmountIn,
            minAmount,
            to,
            timestamp
        }
    }

    const setLpInput = async (input, max) => {
        try {
            if (!input) {
                _setLpInput('')
                setWithdrawalFee('0')
                setDepositFee('0')
                return
            }
            if (max && Number(input) > Number(max)) input = max
            _setLpInput(input)
            const lpContract = getSingLpContract(selectedLp.lpAddress)
            const formattedLpInput = toWei(input ? input : '0', selectedLp.decimals)
            const { tokenAddress, formatAmountIn } = getWithdrawInfo(input, selectedLp)
            let _withdrawalFee, _depositFee, _withdrawalAmount
            if (isNotEmpty(selectedLp?.lpBalance?.totalSupply)) {
                ;[_withdrawalFee, _depositFee, _withdrawalAmount] = await Promise.all([
                    lpContract.getWithdrawalFee(formattedLpInput),
                    lpContract.getDepositFee(formattedLpInput),
                    routerContract.getRemoveLiquidityAmount(tokenAddress, formatAmountIn)
                ])
                setWithdrawalFee(toEth(_withdrawalFee, selectedLp.decimals))
                setWithdrawalAmount(toEth(_withdrawalAmount, selectedLp.decimals))
            } else {
                setWithdrawalFee('0')
            }
            setDepositFee(toEth(_depositFee, selectedLp.decimals))
        } catch (error) {
            _setLpInput('')
            setWithdrawalFee('0')
            setDepositFee('0')
            console.log(error)
        }
    }

    const depositLp = async (amountIn, token, setLpInput) => {
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
                newAlert({
                    title: 'Approval Complete',
                    subtitle: 'Your transaction has been successfully confirmed to the network.',
                    type: 'success'
                })
                setStatus('complete')
                await update()
                return
            }

            const { tokenAddress, formatAmountIn, minAmount, to, timestamp } = getDepositInfo(
                amountIn,
                token
            )

            const tx = await routerContract.addLiquidity(
                tokenAddress,
                formatAmountIn,
                minAmount,
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
        setLpInput(null)
    }

    const permit = async (token) => {
        try {
            const lpContract = getTokenContract(token.lpAddress, library.getSigner())
            const [nonce, name] = await Promise.all([lpContract.nonces(account), lpContract.name()])
            const message = {
                owner: account,
                spender: data.safe.router,
                value: MAX_UINT256.toString(),
                nonce: nonce.toNumber(),
                deadline: MAX_UINT256.toString()
            }
            const eip712Struct = {
                types: {
                    EIP712Domain: [
                        { name: 'name', type: 'string' },
                        { name: 'version', type: 'string' },
                        { name: 'chainId', type: 'uint256' },
                        { name: 'verifyingContract', type: 'address' }
                    ],
                    Permit: [
                        { name: 'owner', type: 'address' },
                        { name: 'spender', type: 'address' },
                        { name: 'value', type: 'uint256' },
                        { name: 'nonce', type: 'uint256' },
                        { name: 'deadline', type: 'uint256' }
                    ]
                },
                domain: {
                    name,
                    version: '1',
                    chainId: '250',
                    verifyingContract: token.lpAddress
                },
                primaryType: 'Permit'
            }
            const eip712Message = JSON.stringify({
                ...eip712Struct,
                message
            })
            const signedMessage = await library.send('eth_signTypedData_v4', [
                account,
                eip712Message
            ])
            const sig = ethers.utils.splitSignature(signedMessage)
            return [sig.v, sig.r, sig.s]
        } catch (error) {
            console.log(error)
        }
    }

    const withdrawLp = async (amountIn, token, setLpInput) => {
        try {
            setStatus('loading')
            // let sig
            console.log(token)
            if (Number(token?.lpBalance?.allowBalance) < Number(amountIn)) {
                // sig = await permit(token)
                const depositTokenContract = getTokenContract(token.lpAddress, library.getSigner())
                const tx = await depositTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(amountIn, token.decimals)
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
            const { tokenAddress, formatAmountIn, minAmount, to, timestamp } = getWithdrawInfo(
                amountIn,
                token
            )
            const tx = sig
                ? await routerContract.removeLiquidityWithPermit(
                      tokenAddress,
                      formatAmountIn,
                      Number(minAmount).toFixed(0),
                      to,
                      timestamp,
                      true,
                      sig[0],
                      sig[1],
                      sig[2]
                  )
                : await routerContract.removeLiquidity(
                      tokenAddress,
                      formatAmountIn,
                      Number(minAmount).toFixed(0),
                      to,
                      timestamp
                  )
            await tx.wait(1)
            await update()
            setStatus('complete')
            newAlert({
                title: 'Withdrawal Complete',
                subtitle: 'Your transaction has been successfully confirmed to the network.',
                type: 'success'
            })
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
            newAlert({
                title: 'Withdrawal Failed',
                subtitle: 'Your transaction has not been completed.',
                type: 'fail'
            })
            console.log(error)
        }
        setLpInput(null)
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
        setStatus,
        statusMessage,
        selectedLp,
        setSelectedLp,
        lpInput,
        setLpInput,
        isWithdrawal,
        isUnderlyingApproved,
        isLpApproved,
        setIsWithdrawal,
        slippageTolerance,
        setSlippageTolerance,
        withdrawalFee,
        setWithdrawalFee,
        depositFee,
        setDepositFee,
        withdrawLp,
        depositLp,
        mintTestToken,
        lpToUnderlying,
        underlyingToLp,
        withdrawalAmount
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
