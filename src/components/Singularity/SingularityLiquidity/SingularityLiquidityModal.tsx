import useSingularityLiquidity from '../../../hooks/useSingularityLiquidity'
import { commaFormatter, currentEpoch } from '../../../utils'
import Button from '../../Button'
import Input from '../../Input'
import Modal from '../../Modal'

export default function SingularityLiquidityModal() {
    const {
        selectedLp,
        setSelectedLp,
        lpInput,
        setLpInput,
        isWithdraw,
        setIsWithdraw,
        slippageTolerance,
        setSlippageTolerance,
        withdrawFee,
        setWithdrawFee,
        depositReward,
        setDepositReward,
        withdrawLp,
        depositLp
    } = useSingularityLiquidity()

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
                            onChange={(e) => setLpInput(e.target.value)}
                        />
                        <div className="flex">
                            <p className="flex-1">data</p>
                            <p>data</p>
                        </div>
                    </div>

                    {!isWithdraw && (
                        <div>
                            <p className="">WalletBalance: {selectedLp?.walletBalance}</p>

                            <p>tokenPrice: {selectedLp?.tokenPrice}</p>
                            <p>Reward: {depositReward}</p>

                            <p>
                                Ur Deposits:
                                {selectedLp?.lpBalance.walletBalance *
                                    selectedLp?.pricePerShare}{' '}
                                {'=>'}{' '}
                                {selectedLp?.lpBalance.walletBalance * selectedLp?.pricePerShare +
                                    Number(lpInput) * selectedLp?.pricePerShare}
                            </p>

                            <p>
                                Last Updated: {(currentEpoch - selectedLp?.lastUpdated).toFixed(0)}{' '}
                                Seconds
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
                            <p>lpWalletBalance: {selectedLp?.lpBalance.walletBalance}</p>

                            <p>Price Oracle: {selectedLp?.tokenPrice}</p>
                            <p>Amount Withdrawn: {Number(lpInput) * selectedLp?.pricePerShare}</p>
                            <p>Fees: {commaFormatter(withdrawFee)}</p>

                            <p>
                                Ur Deposits:
                                {selectedLp?.lpBalance.walletBalance *
                                    selectedLp?.pricePerShare}{' '}
                                {'=>'}{' '}
                                {selectedLp?.lpBalance.walletBalance * selectedLp?.pricePerShare -
                                    Number(lpInput)}
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
                        <Button
                            className="bg-blue-500"
                            onClick={
                                isWithdraw
                                    ? () => withdrawLp(lpInput, selectedLp)
                                    : () => depositLp(lpInput, selectedLp)
                            }
                        >
                            {isWithdraw ? 'Withdraw' : 'Deposit'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
