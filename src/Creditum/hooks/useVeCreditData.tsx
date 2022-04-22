import { createContext, useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import * as constants from '../../data'
import { toEth } from '../../utils'
import {
    getTokenContract,
    getVeTokenContract,
    getVeTokenFeesContract,
    getXTokenContract
} from '../../utils/ContractService'
import useRefresh from '../../hooks/useRefresh'

const veCreditAddress = constants.CONTRACT_CREDITUM[250].token.vetoken
const xCreditAddress = constants.CONTRACT_CREDITUM[250].token.xtoken
const creditAddress = constants.CONTRACT_CREDITUM[250].token.address

export function useVeCreditDataInternal() {
    const [veCreditData, setVeCreditData] = useState({})
    const { slowRefresh } = useRefresh()
    const { account } = useActiveWeb3React()
    const veCreditContract = getVeTokenContract(veCreditAddress)
    const xCreditContract = getXTokenContract(xCreditAddress)
    const creditContract = getTokenContract(creditAddress)
    const feesContract = getVeTokenFeesContract()
    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    const fetchData = async () => {
        try {
            if (account) {
                const [
                    allow,
                    tokenBal,
                    xTokenBalance,
                    xtokenShare,
                    xTokenValue,
                    veCreditBal,
                    veCreditTotalSupply,
                    locked,
                    veTokenValue,
                    rewardTime,
                    totalRewardAmount,
                    userRewardAmount
                ] = await Promise.all([
                    creditContract.allowance(account, veCreditAddress),
                    creditContract.balanceOf(account),
                    xCreditContract.balanceOf(account),
                    xCreditContract.getShareValue(),
                    creditContract.balanceOf(xCreditAddress),
                    veCreditContract['balanceOf(address)'](account),
                    veCreditContract.supply(),
                    veCreditContract.locked(account),
                    creditContract.balanceOf(veCreditAddress),
                    feesContract.time_cursor(),
                    feesContract.token_last_balance(),
                    feesContract.callStatic['claim(address)'](account)
                ])

                return {
                    allowance: toEth(allow),
                    tokenBal: toEth(tokenBal),
                    xTokenBalance: toEth(xTokenBalance),
                    xtokenShare: toEth(xtokenShare),
                    xTokenValue: toEth(xTokenValue),
                    veCreditBal: toEth(veCreditBal),
                    veCreditTotalSupply: toEth(veCreditTotalSupply),
                    creditLocked: toEth(locked.amount),
                    lockEnd: locked.end.toNumber(),
                    veTokenValue: toEth(veTokenValue),
                    rewardTime: Number(rewardTime),
                    totalRewardAmount: toEth(totalRewardAmount),
                    userRewardAmount: toEth(userRewardAmount),
                    estimatedReward: toEth(
                        totalRewardAmount.mul(veCreditBal).div(veCreditTotalSupply)
                    )
                }
            } else {
                const [xtokenShare, xTokenValue, veCreditTotalSupply, veTokenValue, rewardTime, totalRewardAmount] =
                    await Promise.all([
                        xCreditContract.getShareValue(),
                        creditContract.balanceOf(xCreditAddress),
                        veCreditContract['totalSupply()'](),
                        veCreditContract.supply(),
                        feesContract.time_cursor(),
                        feesContract.token_last_balance(),
                    ])
                return {
                    xtokenShare: toEth(xtokenShare),
                    xTokenValue: toEth(xTokenValue),
                    veTokenValue: toEth(veTokenValue),
                    veCreditTotalSupply: toEth(veCreditTotalSupply),
                    rewardTime: Number(rewardTime),
                    totalRewardAmount: toEth(totalRewardAmount)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchData().then((res) => {
            res && setVeCreditData(res)
        })
    }, [account, refresh, slowRefresh])

    return {
        veCreditData,
        update
    }
}

const VeCreditDataContext = createContext({})

export const VeCreditDataWrapper = ({ children }) => {
    const veCredit = useVeCreditDataInternal()
    return (
        <VeCreditDataContext.Provider value={{ ...veCredit }}>
            {children}
        </VeCreditDataContext.Provider>
    )
}

export default function useVeCreditData() {
    return useContext(VeCreditDataContext) as any
}
