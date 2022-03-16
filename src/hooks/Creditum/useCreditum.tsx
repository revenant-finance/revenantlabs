import { useActiveWeb3React } from '..'
import { MAX_UINT256, toWei } from '../../utils'
import { getCreditumContract, getTokenContract } from '../../utils/ContractService'
import useCreditumData from './useCreditumData'

export default function useCreditum() {
    const { account, library } = useActiveWeb3React()
    const { update, creditumData } = useCreditumData()

    const enter = async (market, depositAmount, borrowAmount) => {
        if (account) {
            console.log(market, depositAmount, borrowAmount)
            let tx = null
            const cToken = creditumData.cusd.mintToken
            const creditumContract = getCreditumContract(cToken.creditum, library.getSigner())
            const tokenContract = getTokenContract(market.address, library.getSigner())
            try {
                if (Number(market.allowBalance) < Number(depositAmount)) {
                    tx = await tokenContract.approve(creditumContract.address, MAX_UINT256)
                } else {
                    console.log(
                        toWei(depositAmount, market.decimals).toString(),
                        toWei(borrowAmount).toString()
                    )
                    tx = await creditumContract.enter(
                        market.address,
                        toWei(depositAmount, market.decimals),
                        toWei(borrowAmount)
                    )
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
    }

    const exit = async (market, withdrawAmount, repayAmount) => {
        if (account) {
            let tx = null
            const cToken = creditumData.cusd.mintToken
            const creditumContract = getCreditumContract(cToken.creditum, library.getSigner())
            const cTokenContract = getTokenContract(cToken.address, library.getSigner())
            try {
                if (Number(cToken.allowBalance) < Number(repayAmount)) {
                    tx = await cTokenContract.approve(creditumContract.address, MAX_UINT256)
                } else {
                    tx = await creditumContract.exit(
                        market?.address,
                        toWei(withdrawAmount, market.decimals),
                        toWei(repayAmount)
                    )
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
    }

    const stabilizerMint = async (market, depositAmount) => {
        if (account) {
            let tx = null
            const cToken = creditumData.cusd.mintToken
            const creditumContract = getCreditumContract(cToken.creditum, library.getSigner())
            const tokenContract = getTokenContract(market.address, library.getSigner())
            try {
                if (Number(market?.allowBalance) < Number(depositAmount)) {
                    tx = await tokenContract.approve(creditumContract.address, MAX_UINT256)
                } else {
                    tx = await creditumContract.stabilizerMint(
                        market?.address,
                        toWei(depositAmount, market?.decimals)
                    )
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
    }

    const stabilizerRedeem = async (underlying, burnAmount) => {
        if (account) {
            let tx = null
            const cToken = creditumData.cusd.mintToken
            const creditumContract = getCreditumContract(cToken.creditum, library.getSigner())
            const cTokenContract = getTokenContract(cToken.address, library.getSigner())
            try {
                if (Number(cToken?.allowBalance) < Number(burnAmount)) {
                    tx = await cTokenContract.approve(creditumContract.address, MAX_UINT256)
                } else {
                    tx = await creditumContract.stabilizerRedeem(
                        underlying?.address,
                        toWei(burnAmount)
                    )
                }
                await tx.wait(1)
                update()
            } catch (error) {
                console.log(error)
            }
        }
    }

    return {
        enter,
        exit,
        stabilizerMint,
        stabilizerRedeem
    }
}
