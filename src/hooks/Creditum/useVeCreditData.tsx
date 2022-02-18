import { useEffect, useState } from 'react'
import { getXTokenContract, getTokenContract, getVeTokenContract } from '../../utils/ContractService'
import { toEth } from '../../utils'
import { useWallet } from 'use-wallet'
import * as constants from '../../data'
import { ethers } from 'ethers'
import useRefresh from '../useRefresh'

const veCreditAddress = constants.CONTRACT_CREDITUM[250].token.vetoken
const xCreditAddress = constants.CONTRACT_CREDITUM[250].token.xtoken
const creditAddress = constants.CONTRACT_CREDITUM[250].token.address

export default function useVeCreditData() {
    //CREDIT: tokenBal
    //xCREDIT: xtokenBal, xtokenShare
    //veCREDIT: lockEnd, veCreditBal, veCreditTotalSupply, creditLocked
    const [veCreditData, setVeCreditData] = useState({})
    const { slowRefresh } = useRefresh()
    const { account, ethereum } = useWallet()
    const provider = account ? new ethers.providers.JsonRpcProvider(ethereum).getSigner() : null
    const veCreditContract = getVeTokenContract(veCreditAddress, provider)
    const xCreditContract = getXTokenContract(xCreditAddress, provider)
    const creditContract = getTokenContract(creditAddress, provider)
    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    const fetchData = async () => {
        try {
            console.log(veCreditContract)
            console.log(await veCreditContract.supply())
            if (account) {
                const [allow, tokenBal, xtokenBal, xtokenShare, lockEnd, veCreditBal, veCreditTotalSupply, creditLocked] = await Promise.all([
                    creditContract.allowance(account, veCreditAddress),
                    creditContract.balanceOf(account),
                    xCreditContract.balanceOf(account),
                    xCreditContract.getShareValue(),
                    veCreditContract.locked__end(account),
                    veCreditContract.balanceOf(account),
                    veCreditContract.supply(),
                    //unknown parameter
                    veCreditContract.locked(account)
                ])

                return {
                    allowance: toEth(allow),
                    tokenBal: toEth(tokenBal),
                    xtokenBal: toEth(xtokenBal),
                    xtokenShare: toEth(xtokenShare),
                    lockEnd,
                    veCreditBal: toEth(veCreditBal),
                    veCreditTotalSupply: toEth(veCreditTotalSupply),
                    creditLocked: toEth(creditLocked)
                }
            } else {
                const [xtokenShare, veCreditTotalSupply] = await Promise.all([xCreditContract.getShareValue(), veCreditContract.supply()])
                return {
                    xtokenShare: toEth(xtokenShare),
                    veCreditTotalSupply: toEth(veCreditTotalSupply),
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
