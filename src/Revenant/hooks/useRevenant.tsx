import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { CONTRACT_REVENANT } from '../../data'
import merkle from '../../data/Revenant/merkle.json'
import { toEth, toWei } from '../../utils'
import { fetchBalances, getMerkleContract, getRevenantContract } from '../../utils/ContractService'
import useRefresh from '../../hooks/useRefresh'

export default function useRevenant() {
    const [status, setStatus] = useState(true)
    const [claimRVNT, setClaimRVNT] = useState('0')
    const [walletRVNT, setWalletRVNT] = useState('0')
    const [merkleData, setMerkleData] = useState(null)

    const { account, library } = useActiveWeb3React()
    const { slowRefresh } = useRefresh()
    // const [, setToast] = useToasts()

    const rvnt = CONTRACT_REVENANT[250].token
    const mrk = CONTRACT_REVENANT[250].merkle

    const revenantContract = getRevenantContract(rvnt.address, library.getSigner())
    const merkleContract = getMerkleContract(mrk)

    const claim = async () => {
        if (!account) {
            // setToast({ text: 'No account connected', type: 'error' })
            return
        }

        if (Number(claimRVNT) <= 0) {
            // setToast({ text: 'No RVNT available to claim', type: 'error' })
            return
        }
        try {
            const tx = await merkleContract.claim(
                merkleData.Index,
                account,
                merkleData.Amount,
                merkleData.Proof
            )
            await tx.wait(5)
            setClaimRVNT('0')
            setStatus(!status)
        } catch (e) {
            console.log(e)
        }
    }

    const burn = async (amount) => {
        if (!account) {
            // setToast({ text: 'No account connected', type: 'error' })
            return
        }

        try {
            const tx = await revenantContract.burn(toWei(amount))
            await tx.wait(5)
            setStatus(!status)
        } catch (e) {
            console.log(e)
        }
    }

    const getRVNTBalance = async () => {
        const balanceCall = await fetchBalances(account, [rvnt], revenantContract.address, 'address')
        const balance = balanceCall[0].walletBalance
        return balance
    }

    const getClaimBalance = async () => {
        const userData = merkle[account]
        if (!userData) return
        const claimed = await merkleContract.isClaimed(userData.Index)
        let amountClaim = '0'
        if (!claimed) {
            amountClaim = userData.Amount
        }
        return { userData, amountClaim }
    }

    useEffect(() => {
        if (account) {
            getRVNTBalance().then((res) => {
                setWalletRVNT(res)
            })
            getClaimBalance().then((res) => {
                res && setClaimRVNT(toEth(res.amountClaim))
                res && setMerkleData(res.userData)
            })
        }
    }, [account, slowRefresh, status])

    return { claimRVNT, walletRVNT, claim, burn }
}
