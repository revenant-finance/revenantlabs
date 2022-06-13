import { useState } from 'react'
import useSingularitySwapper from '../hooks/useSingularitySwapper'
import { formatter, isNotEmpty } from '../../utils'
import Modal from '../../components/Modals/Modal'
import Portal from '../../components/Modals/Portal'

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
