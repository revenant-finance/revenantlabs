import { useEffect, useState } from 'react'
import { getXTokenContract, getTokenContract, getVeTokenContract, getVeTokenFeesContract } from '../../utils/ContractService'
import { toEth } from '../../utils'
import * as constants from '../../data'
import useRefresh from '../useRefresh'
import { useActiveWeb3React } from '..'

const veCreditAddress = constants.CONTRACT_CREDITUM[250].token.vetoken
const xCreditAddress = constants.CONTRACT_CREDITUM[250].token.xtoken
const creditAddress = constants.CONTRACT_CREDITUM[250].token.address

export default function useVeCreditData() {
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
                const [allow, tokenBal, xTokenBalance, xtokenShare, xTokenValue, veCreditBal, veCreditTotalSupply, locked, veTokenValue] = await Promise.all([
                    creditContract.allowance(account, veCreditAddress),
                    creditContract.balanceOf(account),
                    xCreditContract.balanceOf(account),
                    xCreditContract.getShareValue(),
                    creditContract.balanceOf(xCreditAddress),
                    veCreditContract['balanceOf(address)'](account),
                    veCreditContract["totalSupply()"](),
                    //unknown parameter
                    veCreditContract.locked(account),
                    veCreditContract.supply()
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
                }
            } else {
                const [xtokenShare, xTokenValue, veCreditTotalSupply, veTokenValue] = await Promise.all([xCreditContract.getShareValue(), creditContract.balanceOf(xCreditAddress), veCreditContract["totalSupply()"](), veCreditContract.supply()])
                return {
                    xtokenShare: toEth(xtokenShare),
                    xTokenValue: toEth(xTokenValue),
                    veTokenValue: toEth(veTokenValue),
                    veCreditTotalSupply: toEth(veCreditTotalSupply)
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
