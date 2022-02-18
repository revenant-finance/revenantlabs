import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'
import * as constants from '../../data'
import { MAX_UINT256, toEth, toWei } from '../../utils'
import { getTokenContract, getVeTokenContract, getXTokenContract } from '../../utils/ContractService'

const veCreditAddress = constants.CONTRACT_CREDITUM[250].token.vetoken
const xCreditAddress = constants.CONTRACT_CREDITUM[250].token.xtoken
const creditAddress = constants.CONTRACT_CREDITUM[250].token.address

export default function useVeCredit() {
    const { account, ethereum } = useWallet()
    const provider = account ? new ethers.providers.JsonRpcProvider(ethereum).getSigner() : null

    const veCreditContract = getVeTokenContract(veCreditAddress, provider)
    const xCreditContract = getXTokenContract(xCreditAddress, provider)
    const creditContract = getTokenContract(creditAddress, provider)

    const approve = async () => {
        if (!account) return
        try {
            const tx = await creditContract.approve(veCreditAddress, MAX_UINT256)
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
            const allowance = await creditContract.allowance(account, veCreditContract)
            if (Number(toEth(allowance)) < Number(amount)) {
                tx = await creditContract.approve(veCreditAddress, MAX_UINT256)
                await tx.wait(1)
            } else {
                tx = await veCreditContract.create_lock(toWei(amount), time)
            }
            await tx.wait(1)
            // update()
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
            //may need allowance
            tx = await veCreditContract.increase_amount(amount)
            await tx.wait(1)
            // update()
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
            // update()
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
            // update()
        } catch (error) {
            console.log(error)
        }
    }

    //migration stuff
    async function unstakeXCredit(amount) {
        if (!account) return
        let tx = null
        try {
            tx = await xCreditContract.unstake(toWei(amount))
            await tx.wait(1)
            console.log(tx)
            // update()
        } catch (error) {
            console.log(error)
        }
    }

    return { approve, initialDeposit, increaseAmount, increaseLockTime, withdraw, unstakeXCredit }
}
