import { useState } from 'react'
import useRevenant from '../hooks/Revenant/useRevenant'
import { formatter } from '../utils'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'

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
                        <p className="text-xs text-center font-medium">Claim Tokens</p>
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
                        <div className="h-1 w-full bg-neutral-800"></div>
                        <p className="text-neutral-800 font-medium uppercase text-xs">Or</p>
                        <div className="h-1 w-full bg-neutral-800"></div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs text-center font-medium">Burn Tokens</p>
                        <p className="opacity-50 text-sm font-medium">
                            Burn your RVNT to get CREDIT. You will receive 10 CREDIT for every RVNT
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
                            Burn {formatter(burnAmount)} RVNT for {formatter(burnAmount * 10)}{' '}
                            CREDIT.
                        </Button>
                    </div>
                </div>
            </Modal>

            <button
                onClick={() => setShowModal(true)}
                className="underline opacity-50 hover:underline-none hover:opacity-75"
                // className="px-4 py-2 bg-gradient-to-br text-white from-salmon to-purp rounded-full font-medium md:text-xl shadow-2xl"
            >
                Claim RVNT
            </button>
        </>
    )
}
