import { useState } from 'react'
import { getCreditumContract, getTokenContract } from '../../utils/ContractService'
import { toWei, MAX_UINT256 } from '../../utils'
import useCreditumData from './useCreditumData'
import { useActiveWeb3React } from '..'

export default function useCreditum() {
    const [status, setStatus] = useState('idle')
    const { account, library } = useActiveWeb3React()
    const { update } = useCreditumData()

    const enter = async (market, depositAmount, borrowAmount) => {
        setStatus('loading')
        if (account) {
            let tx = null
            const cToken = market?.cToken
            const creditumContract = getCreditumContract(cToken?.creditum, library.getSigner())
            const tokenContract = getTokenContract(market?.address, library.getSigner())
            try {
                if (Number(market?.allowBalance) < Number(depositAmount)) {
                    tx = await tokenContract.approve(creditumContract?.address, MAX_UINT256)
                } else {
                    tx = await creditumContract.enter(market?.address, toWei(depositAmount, market.decimals), toWei(borrowAmount))
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
        setStatus('idle')
    }

    const exit = async (market, withdrawAmount, repayAmount) => {
        setStatus('loading')
        if (account) {
            let tx = null
            const cToken = market?.cToken
            const creditumContract = getCreditumContract(cToken?.creditum, library.getSigner())
            const cTokenContract = getTokenContract(cToken?.address, library.getSigner())
            try {
                if (Number(cToken.allowBalance) < Number(repayAmount)) {
                    tx = await cTokenContract.approve(creditumContract.address, MAX_UINT256)
                } else {
                    tx = await creditumContract.exit(market?.address, toWei(withdrawAmount, market.decimals), toWei(repayAmount))
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
        setStatus('idle')
    }

    const stabilizerMint = async (market, depositAmount) => {
        setStatus('loading')
        if (account) {
            let tx = null
            const cToken = market?.cToken
            const creditumContract = getCreditumContract(cToken?.creditum, library.getSigner())
            const tokenContract = getTokenContract(market?.address, library.getSigner())
            try {
                if (Number(market?.allowBalance) < Number(depositAmount)) {
                    tx = await tokenContract.approve(creditumContract.address, MAX_UINT256)
                } else {
                    tx = await creditumContract.stabilizerMint(market?.address, toWei(depositAmount, market?.decimals))
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
        setStatus('idle')
    }

    const stabilizerRedeem = async (underlying, burnAmount) => {
        setStatus('loading')
        console.log(toWei(burnAmount, underlying.decimals).toString())
        if (account) {
            let tx = null
            const cToken = underlying?.cToken
            const creditumContract = getCreditumContract(cToken?.creditum, library.getSigner())
            const cTokenContract = getTokenContract(cToken?.address, library.getSigner())
            try {
                if (Number(cToken?.allowBalance) < Number(burnAmount)) {
                    tx = await cTokenContract.approve(creditumContract.address, MAX_UINT256)
                } else {
                    tx = await creditumContract.stabilizerRedeem(underlying?.address, toWei(burnAmount))
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
        setStatus('idle')
    }

    return {
        enter,
        exit,
        stabilizerMint,
        stabilizerRedeem,
        status
    }
}
