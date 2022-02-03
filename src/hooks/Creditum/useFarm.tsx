import { getFarmsContract, getTokenContract } from '../../utils/ContractService'
import { useActiveWeb3React } from '..'
import farms from '../../constants/data/farms.json'
import { toEth, toWei, MAX_UINT256 } from '../../utils'
import useFarmData from './useFarmData'

export default function useFarm() {
    const { account, library } = useActiveWeb3React()
    const farmContract = getFarmsContract(library?.getSigner())
    
    const { update } = useFarmData()

    const deposit = async (pid, amount) => {
        if (!account) return
        try {
            const farmData = farms.filter((farm) => farm.pid === pid)[0]
            const tokenContract = getTokenContract(farmData.lpAddress, library.getSigner())
            let tx
            const allowance = await tokenContract.allowance(account, farmContract.address)
            if (Number(amount) > Number(toEth(allowance))) {
                tx = await tokenContract.approve(farmContract.address, MAX_UINT256)
                await tx.wait(1)
            }
            tx = await farmContract.deposit(pid, toWei(amount))
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (ex) {
            console.error(ex)
        }
    }

    const claim = async (pid) => {
        if (!account) return
        try {
            let tx
            tx = await deposit(pid, '0')
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (ex) {
            console.error(ex)
        }
    }

    // const claimAll = async () => {
    //     if (!account) return
    //         try {
    //             let tx
    //             for (let i = 0; i < farms.length; i++) {
    //                 const tempFarm = farmsArray[i]
    //                 if (Number(toEth(allRewards[i][tempFarm.rid])) > 0) {
    //                     tx = await claim(tempFarm.pid)
    //                     await tx.wait(5)
    //                 }
    //             }
    //             console.log('transaction done')
    //             setStatus('idle')
    //             setRefresh(!refresh)
    //         } catch (ex) {
    //             console.error(ex)
    //         }

    // }

    const withdraw = async (pid, amount) => {
        if (!account) return
        try {
            let withdrawAmount = toWei(amount)
            // const deposited = await getDeposited(pid)
            // if (Number(toEth(amount)) > Number(deposited)) {
            //     withdrawAmount = deposited
            // }
            let tx = await farmContract.withdraw(pid, withdrawAmount)
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (ex) {
            console.error(ex)
        }
    }

    return {
        deposit,
        withdraw,
        claim,
    }
}
