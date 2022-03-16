import { useState } from 'react'
import Modal from './Modal'

export default function NotReadyModal() {
    const [show, setShow] = useState(true)
    return (
        <Modal visible={show} onClose={() => {}}>
            <div className="space-y-4">
                <p className="text-2xl font-extrabold">This app is not ready to be used, yet.</p>
                <p>
                    Please come back at a later date to use this application. If you try to use it
                    now, you are subject to a high-risk of loss and/or other unexplored issues. We
                    advise staying away.
                </p>
            </div>
        </Modal>
    )
}
