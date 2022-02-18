import { useEffect, useState } from 'react'
import { getXTokenContract, getTokenContract, getVeTokenContract } from '../../utils/ContractService'
import { toEth } from '../../utils'
import * as constants from '../../data'
import useRefresh from '../useRefresh'
import { useActiveWeb3React } from '..'

const veCreditAddress = constants.CONTRACT_CREDITUM[250].token.vetoken
const xCreditAddress = constants.CONTRACT_CREDITUM[250].token.xtoken
const creditAddress = constants.CONTRACT_CREDITUM[250].token.address

export default function useVeCreditData() {
    //CREDIT: tokenBal
    //xCREDIT: xtokenBal, xtokenShare
    //veCREDIT: lockEnd, veCreditBal, veCreditTotalSupply, creditLocked
    const [veCreditData, setVeCreditData] = useState({})
    const { slowRefresh } = useRefresh()
    const { account } = useActiveWeb3React()
    const veCreditContract = getVeTokenContract(veCreditAddress)
    const xCreditContract = getXTokenContract(xCreditAddress)
    const creditContract = getTokenContract(creditAddress)
    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    const fetchData = async () => {
        try {
            if (account) {
                const [allow, tokenBal, xtokenBal, xtokenShare, veCreditBal, veCreditTotalSupply, locked] = await Promise.all([
                    creditContract.allowance(account, veCreditAddress),
                    creditContract.balanceOf(account),
                    xCreditContract.balanceOf(account),
                    xCreditContract.getShareValue(),
                    veCreditContract['balanceOf(address)'](account),
                    veCreditContract.supply(),
                    //unknown parameter
                    veCreditContract.locked(account)
                ])

                return {
                    allowance: toEth(allow),
                    tokenBal: toEth(tokenBal),
                    xtokenBal: toEth(xtokenBal),
                    xtokenShare: toEth(xtokenShare),
                    veCreditBal: toEth(veCreditBal),
                    veCreditTotalSupply: toEth(veCreditTotalSupply),
                    creditLocked: toEth(locked.amount),
                    lockEnd: locked.toNumber()
                }
            } else {
                const [xtokenShare, veCreditTotalSupply] = await Promise.all([xCreditContract.getShareValue(), veCreditContract.supply()])
                return {
                    xtokenShare: toEth(xtokenShare),
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
