import { useState } from 'react'
import useSingularitySwapper from '../../hooks/useSwapper'
import { formatter, isNotEmpty } from '../../utils'
import Modal from '../Modals/Modal'
import Portal from '../Modals/Portal'

export default function SlippageModal() {
    const {
        tokens,
        fromToken,
        toToken,
        setFromToken,
        setToToken,
        showSelectTokenModal,
        setShowSelectTokenModal,
        selectingToken,
        addToken,
        setFromValue
    } = useSingularitySwapper()

    const [slippage, setSlippage] = useState('')

    return (
        <Portal>
            <Modal visible={showSlippageModal} onClose={() => setShowSlippageModal(false)}>

            </Modal>
        </Portal>
    )
}
