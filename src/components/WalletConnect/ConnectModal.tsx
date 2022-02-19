import { connectorLocalStorageKey } from '../../hooks'
import config from './config'
import Modal from '../Modal'
import Button from '../Button'

export default function ConnectModal({ open, login, onDismiss = () => null }) {
    return (
        <Modal visible={open} onClose={onDismiss}>
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
        </Modal>
    )
}
