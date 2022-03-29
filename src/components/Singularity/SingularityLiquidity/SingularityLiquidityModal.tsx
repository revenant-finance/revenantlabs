import { useState } from 'react'
import useSingularity from '../../../hooks/useSingularity'
import Button from '../../Button'
import Input from '../../Input'
import Modal from '../../Modal'
import { getTokenContract, getSingLpContract, getSingRouterContract } from '../../../utils/ContractService'
import { toWei, toEth, MAX_UINT256, commaFormatter } from '../../../utils'
import { useActiveWeb3React } from '../../../hooks'

export default function SingularityLiquidityModal() {
    const { account, library } = useActiveWeb3React()
    const { data, selectedLp, setSelectedLp } = useSingularity()

    const [lpInput, setLpInput] = useState('')
    const [isWithdraw, setIsWithdraw] = useState(false)

    const [slippageTolerance, setSlippageTolerance] = useState(0.1)
    const [withdrawFee, setWithdrawFee] = useState('0')
    const [depositReward, setDepositReward] = useState('0')

    const routerContract = data?.safe && getSingRouterContract(data.safe.router, account ? library.getSigner() : null)

    const inverseSlippage = (1 - slippageTolerance) * 100


    const _setLpInput = async (input) => {
        setLpInput(input)
        const lpContract = getSingLpContract(selectedLp.lpAddress)
        const formattedLpInput = toWei(input ? input : '0', selectedLp.decimals)
        const [_withdrawFee, _depositReward] = await Promise.all([lpContract.getWithdrawFee(formattedLpInput), lpContract.getDepositFee(formattedLpInput)])
        setWithdrawFee(toEth(_withdrawFee, selectedLp.decimals))
        setDepositReward(toEth(_depositReward, selectedLp.decimals))
    }

    const depositLp = async (amountIn, token) => {
        try {
            if (Number(token?.allowBalance) < Number(amountIn)) {
                const depositTokenContract = getTokenContract(token.address, library.getSigner())
                await depositTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(amountIn, token.decimals)
                )
            }
            const to = account
            const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
            const formatAmountIn = toWei(amountIn, token.decimals)
            const formatPricePerShare = toWei(Number(token.pricePerShare).toFixed(token.decimals), token.decimals)
            const minAmount = formatAmountIn.mul(100).mul(inverseSlippage).div(formatPricePerShare).div(10000)
            await routerContract.addLiquidity(
                token.address,
                formatAmountIn,
                toWei(String(minAmount), token.decimals),
                to,
                timestamp
            )
        } catch (error) {
            console.log(error)
        }
    }

    const withdrawLp = async(amountIn, token) => {
        try {
            if (Number(token?.lpBalance.allowBalance) < Number(amountIn)) {
                const fromTokenContract = getTokenContract(token.lpAddress, library.getSigner())
                await fromTokenContract.approve(
                    data.safe.router,
                    MAX_UINT256
                    // toWei(amountIn)
                )
            }
            const to = account
            const timestamp = Math.floor(Date.now() / 1000) + 60 * 10
            const formatAmountIn = toWei(amountIn, token.decimals)
            const formatPricePerShare = toWei(Number(token.pricePerShare).toFixed(token.decimals), token.decimals)
            const minAmount = Number(toEth(formatAmountIn.mul(100).mul(inverseSlippage).mul(formatPricePerShare).div(10000), token.decimals)).toFixed(0)
            await routerContract.removeLiquidity(
                token.address,
                formatAmountIn,
                minAmount,
                to,
                timestamp
            )
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal visible={selectedLp ? true : false} onClose={() => setSelectedLp(null)}>
                <div className="space-y-4">
                    <Button onClick={() => setIsWithdraw((_) => !_)} className="bg-blue-500">
                        {isWithdraw ? 'Withdraw' : 'Deposit'}
                    </Button>

                    <div className="space-y-2">
                        <p>confirm {isWithdraw ? 'withdraw' : 'deposit'}</p>
                        <Input
                            type="number"
                            value={lpInput}
                            onChange={(e) => _setLpInput(e.target.value)}
                        />
                        <div className="flex">
                            <p className="flex-1">data</p>
                            <p>data</p>
                        </div>
                    </div>

                    {!isWithdraw && (
                        <div>
                            <p>Deposit: {lpInput}</p>
                            <p>tokenPrice: {selectedLp?.tokenPrice}</p>
                            <p>Reward: {depositReward}</p>

                            <p>
                                Ur Deposits:{selectedLp?.lpBalance.walletBalance * selectedLp?.pricePerShare} {'=>'} {selectedLp?.lpBalance.walletBalance * selectedLp?.pricePerShare + (Number(lpInput) * selectedLp?.pricePerShare)}
                            </p>

                            <div className="flex items-center text-xs">
                                    <p className="flex-1">Slippage</p>
                                    <Input
                                        type="number"
                                        value={slippageTolerance}
                                        onChange={(e) => setSlippageTolerance(e.target.value)}
                                        onMax={() => setSlippageTolerance(100)}
                                    />
                                    {/* <p className="">0.1%</p> */}
                                </div>
                        </div>
                    )}

                    {isWithdraw && (
                        <div>
                            <p>Price Oracle: {selectedLp?.tokenPrice}</p>
                            <p>Amount Withdrawn: {Number(lpInput) * selectedLp?.pricePerShare}</p>
                            <p>Fees: {commaFormatter(withdrawFee)}</p>

                            <p>
                                Ur Deposits:{selectedLp?.lpBalance.walletBalance * selectedLp?.pricePerShare} {'=>'} {selectedLp?.lpBalance.walletBalance * selectedLp?.pricePerShare - Number(lpInput)}
                            </p>

                            <div className="flex items-center text-xs">
                                    <p className="flex-1">Slippage</p>
                                    <Input
                                        type="number"
                                        value={slippageTolerance}
                                        onChange={(e) => setSlippageTolerance(e.target.value)}
                                        onMax={() => setSlippageTolerance(100)}
                                    />
                                    {/* <p className="">0.1%</p> */}
                                </div>
                        </div>
                    )}

                    <div className="flex space-x-6">
                        <Button>Cancel</Button>
                        <Button className="bg-blue-500" onClick={isWithdraw ? () => withdrawLp(lpInput, selectedLp) : () => depositLp(lpInput, selectedLp)}>
                            {isWithdraw ? 'Withdraw' : 'Deposit'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
