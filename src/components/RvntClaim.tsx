import { useState } from 'react'
import Button from './Button'
import Modal from './Modal'

export default function RvntClaim() {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <Modal visible={showModal} onClose={() => setShowModal(false)}>
                <Button>test</Button>
            </Modal>

            <div className="bg-yellow-500 text-yellow-800">
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
                            <button onClick={() => setShowModal((_) => !_)} className="bg-yellow-900 text-yellow-500 font-extrabold whitespace-nowrap uppercase rounded px-4 py-2">
                                Claim Tokens
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
