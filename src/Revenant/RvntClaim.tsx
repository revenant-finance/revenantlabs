import { useState } from 'react'
import useRevenant from './hooks/useRevenant'
import { formatter } from '../utils'
import Button from '../components/Btns/Button'
import Input from '../components/Inputs/Input'
import Modal from '../components/Modals/Modal'

export default function RvntClaim() {
    const [showModal, setShowModal] = useState(false)

    const [burnStatus, setBurnStatus] = useState('')
    const [claimStatus, setClaimStatus] = useState('')

    const [burnAmount, setBurnAmount] = useState(0)
    const { claimRVNT, walletRVNT, claim, burn } = useRevenant()

    const onBurn = async (amount) => {
        try {
            setBurnStatus('loading')
            await burn(amount)
            setBurnStatus('idle')
        } catch (error) {
            setBurnStatus('error')
        }
    }

    const onClaim = async () => {
        try {
            setClaimStatus('loading')
            await claim()
            setClaimStatus('idle')
        } catch (error) {
            setClaimStatus('error')
        }
    }

    return (
        <>
            <Modal visible={showModal} onClose={() => setShowModal(false)}>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-xs font-medium text-center">Claim Tokens</p>
                        <div className="grid grid-cols-2 text-center">
                            <div>
                                <p className="font-medium">{formatter(claimRVNT)} $RVNT</p>
                                <p className="text-xs">Claimabale</p>
                            </div>
                            <div>
                                <p className="font-medium">{formatter(walletRVNT)} $RVNT</p>
                                <p className="text-xs">In Wallet</p>
                            </div>
                        </div>
                        <Button
                            loading={claimStatus === 'loading'}
                            onClick={() => onClaim()}
                            disabled={claimRVNT === '0'}
                            className="bg-salmon text-neutral-900"
                        >
                            {claimRVNT === '0' ? 'Nothing to Claim' : 'Claim Tokens'}
                        </Button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-full h-1 bg-neutral-800"></div>
                        <p className="text-xs font-medium uppercase text-neutral-800">Or</p>
                        <div className="w-full h-1 bg-neutral-800"></div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs font-medium text-center">Burn Tokens</p>
                        <p className="text-sm font-medium opacity-50">
                            Burn your RVNT to get CREDIT. You will receive 20 CREDIT for every RVNT
                            burnt. Disclaimer: Burned RVNT are lost forever and will miss out on
                            future tokens.
                        </p>
                        <Input
                            type="number"
                            value={burnAmount}
                            onChange={(e) => setBurnAmount(e.target.value)}
                            onMax={() => setBurnAmount(walletRVNT)}
                        />

                        <Button
                            loading={burnStatus === 'loading'}
                            disabled={!burnAmount}
                            onClick={() => onBurn(burnAmount)}
                            className="bg-purp text-neutral-900"
                        >
                            Burn {formatter(burnAmount)} RVNT for {formatter(burnAmount * 20)}{' '}
                            CREDIT.
                        </Button>
                    </div>
                </div>
            </Modal>

            <button
                onClick={() => setShowModal(true)}
                className="underline opacity-50 hover:underline-none hover:opacity-75"
                // className="px-4 py-2 font-medium text-white rounded-full shadow-2xl bg-gradient-to-br from-salmon to-purp md:text-xl"
            >
                Claim RVNT
            </button>
        </>
    )
}
