import { useActiveWeb3React } from '../../hooks'
import * as constants from '../data'
import { MAX_UINT256, toEth, toWei } from '../../utils'
import {
    getTokenContract,
    getVeTokenContract,
    getVeTokenFeesContract,
    getXTokenContract
} from '../../utils/ContractService'
import useVeCreditData from './useVeCreditData'

const veCreditAddress = constants.CONTRACT_CREDITUM[250].token.vetoken
const xCreditAddress = constants.CONTRACT_CREDITUM[250].token.xtoken
const creditAddress = constants.CONTRACT_CREDITUM[250].token.address

export default function useVeCredit() {
    const { account, library } = useActiveWeb3React()
    const { update } = useVeCreditData()

    const veCreditContract = getVeTokenContract(veCreditAddress, library.getSigner())
    const xCreditContract = getXTokenContract(xCreditAddress, library.getSigner())
    const creditContract = getTokenContract(creditAddress, library.getSigner())
    const feesContract = getVeTokenFeesContract(library.getSigner())

    const approve = async (amount) => {
        if (!account) return
        try {
            const tx = await creditContract.approve(veCreditAddress, toWei(amount))
            await tx.wait(1)
            // update()
        } catch (ex) {
            console.error(ex)
        }
    }

    //First time locking token, use this function
    async function initialDeposit(amount, time) {
        if (!account || amount === '0') return
        let tx = null
        try {
            const allowance = await creditContract.allowance(account, veCreditContract.address)
            if (Number(toEth(allowance)) < Number(amount)) {
                tx = await creditContract.approve(veCreditAddress, toWei(amount))
            } else {
                //Math.roundDown(unlock time / # of seconds in week) * # of seconds in week
                tx = await veCreditContract.create_lock(toWei(amount), time)
            }
            await tx.wait(1)
            update()
            console.log(tx)
        } catch (error) {
            console.log(error)
        }
    }

    //If already have locked some token, use this function
    async function increaseAmount(amount) {
        if (!account || amount === '0') return
        let tx = null
        try {
            const allowance = await creditContract.allowance(account, veCreditContract.address)
            if (Number(toEth(allowance)) < Number(amount)) {
                tx = await creditContract.approve(veCreditAddress, toWei(amount))
            } else {
                tx = await veCreditContract.increase_amount(toWei(amount))
            }
            await tx.wait(1)
            update()
            console.log(tx)
        } catch (error) {
            console.log(error)
        }
    }

    //increases lock time
    async function increaseLockTime(time) {
        if (!account || time === '0') return
        let tx = null
        try {
            tx = await veCreditContract.increase_unlock_time(time)
            await tx.wait(1)
            update()
            console.log(tx)
        } catch (error) {
            console.log(error)
        }
    }

    //withdraw only if lock time is over
    async function withdraw() {
        if (!account) return
        let tx = null
        try {
            tx = await veCreditContract.withdraw()
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (error) {
            console.log(error)
        }
    }

    async function claim() {
        if (!account) return
        let tx = null
        try {
            tx = await feesContract['claim(address)'](account)
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (error) {
            console.log(error)
        }
    }

    //migration stuff
    async function unstakeXCredit(amount) {
        if (!account) return
        let tx = null
        try {
            tx = await xCreditContract.withdraw(toWei(amount))
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (error) {
            console.log(error)
        }
    }

    return {
        approve,
        initialDeposit,
        increaseAmount,
        increaseLockTime,
        withdraw,
        unstakeXCredit,
        claim
    }
}
