import { Button, Modal } from '@geist-ui/react'

export default function AccountModal({ open, account, logout, onClose }) {
    return (
        <Modal {...{ open, onClose }}>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-left opacity-50">Logged in as:</p>
                    <p className="font-mono text-left truncate">{account}</p>
                </div>

                <a href={`https://ftmscan.com/address/${account}`} target="_blank" className="flex" rel="noreferrer">
                    <Button className="flex-1" type="secondary">
                        View on FTMScan
                    </Button>
                </a>
            </div>
        </Modal>
    )
}
