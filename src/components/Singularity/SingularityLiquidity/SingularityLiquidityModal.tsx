import { useState } from 'react'
import useSingularity from '../../../hooks/useSingularity'
import Button from '../../Button'
import Input from '../../Input'
import Modal from '../../Modal'

export default function SingularityLiquidityModal() {
    const { selectedLp, setSelectedLp, depositLp, withdrawLp } = useSingularity()
    console.log(selectedLp)

    const [lpInput, setLpInput] = useState('')
    const [isWithdraw, setIsWithdraw] = useState(false)

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
                            <p>Deposit: {lpInput}</p>
                            <p>tokenPrice: {selectedLp?.tokenPrice}</p>
                            <p>Fees: {'?????????'}</p>

                            <p>
                                Ur Deposits:{selectedLp.lpBalance.walletBalance * selectedLp.pricePerShare} {'=>'} {'?????????'}
                            </p>
                        </div>
                    )}

                    {isWithdraw && (
                        <div>
                            <p>Price Oracle: {selectedLp?.tokenPrice}</p>
                            <p>Amount Withdrawn: {lpInput}</p>
                            <p>Fees: {'?????????'}</p>

                            <p>
                                Ur Deposits:{selectedLp.lpBalance.walletBalance * selectedLp.pricePerShare} {'=>'} {'?????????'}
                            </p>
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
