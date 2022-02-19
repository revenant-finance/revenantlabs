import { useState } from 'react'
import Button from './Button'
import Modal from './Modal'
import useRevenant from '../hooks/Revenant/useRevenant'
import Input from './Input'

export default function RvntClaim() {
    const [showModal, setShowModal] = useState(false)

    const [burnAmount, setBurnAmount] = useState(0)
    const { claimRVNT, walletRVNT, claim, burn } = useRevenant()

    return (
        <>
            <Modal visible={showModal} onClose={() => setShowModal(false)}>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-xs text-center font-medium">Claim Tokens</p>
                        <div className="grid grid-cols-2 text-center">
                            <div>
                                <p className="font-medium">{claimRVNT} $RVNT</p>
                                <p className="text-xs">Claimabale</p>
                            </div>
                            <div>
                                <p className="font-medium">{walletRVNT} $RVNT</p>
                                <p className="text-xs">In Wallet</p>
                            </div>
                        </div>
                        <Button className="bg-blue-500 text-neutral-900">Claim Tokens</Button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="h-1 w-full bg-neutral-800"></div>
                        <p className="text-neutral-800 font-medium uppercase text-xs">Or</p>
                        <div className="h-1 w-full bg-neutral-800"></div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs text-center font-medium">Burn Tokens</p>
                        <p className="opacity-50 text-sm font-medium">Burn your RVNT to get CREDIT. You will receive 10 CREDIT for every RVNT burnt. Disclaimer: Burned RVNT are lost forever and will miss out on future tokens.</p>
                        <Input type="number" value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)} onMax={() => setBurnAmount(100)} />

                        <Button className="bg-red-500 text-neutral-900">
                            Burn {burnAmount} RVNT for {burnAmount * 10} CREDIT.
                        </Button>
                    </div>
                </div>
            </Modal>

            <div className="bg-neutral-700 border-neutral-900 border-t-2">
                <div className="max-w-5xl container mx-auto p-6 py-12">
                    <div className="flex flex-col items-center sm:flex-row gap-12">
                        <div className="flex flex-1 gap-6">
                            <i className="text-3xl fas fa-exclamation-triangle"></i>
                            <div className="space-y-1">
                                <p className="text-xl font-extrabold">Affected by the StakeSteak exploit in late 2021?</p>
                                <p>Users affected by the StakeSteak exploit are able to claim RVNT tokens now. RVNT tokens are ecosystem-wide redemption tokens, usable to claim allocations of Revenant Labs projects.</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => setShowModal((_) => !_)} className="bg-neutral-900 text-neutral-400 font-extrabold whitespace-nowrap uppercase rounded px-4 py-2">
                                Claim Tokens
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
