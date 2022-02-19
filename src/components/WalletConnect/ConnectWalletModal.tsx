import { connectorLocalStorageKey, useActiveWeb3React } from '../../hooks'
import config from './config'
import Modal from '../Modal'
import Button from '../Button'

export default function ConnectWalletModal({ open, login, onDismiss = () => null }) {
    const { account } = useActiveWeb3React()
    return (
        <Modal visible={open} onClose={onDismiss}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {config.map((entry, index) => (
                        <Button
                            className="bg-neutral-800"
                            key={index}
                            onClick={() => {
                                login(entry.connectorId)
                                window.localStorage.setItem(connectorLocalStorageKey, entry.connectorId)
                                onDismiss()
                            }}
                        >
                            <div className="flex justify-center items-center space-x-2">
                                <img className="w-6 h-6" src={entry.icon} alt="" />
                                <p>{entry.title}</p>
                            </div>
                        </Button>
                    ))}
                </div>
                {account && (
                    <div>
                        <p className="opacity-50 font-medium truncate">Connected as: {account}</p>
                    </div>
                )}
            </div>
        </Modal>
    )
}
