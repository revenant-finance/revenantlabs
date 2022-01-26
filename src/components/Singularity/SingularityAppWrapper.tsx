import { createContext, useContext, useState } from 'react'

export const SingularityIndexPageContext = createContext({})

export function SingularityAppWrapper({ children }) {
    const [showSelectTokenModal, setShowSelectTokenModal] = useState(false)
    const [selectingToken, setSelectingToken] = useState<'from' | 'to'>(null)
    const [fromToken, setFromToken] = useState()
    const [toToken, setToToken] = useState()

    const openModal = (modalType: 'from' | 'to') => {
        setShowSelectTokenModal(true)
        setSelectingToken(modalType)
    }

    return (
        <SingularityIndexPageContext.Provider
            value={{
                openModal,
                showSelectTokenModal,
                setShowSelectTokenModal,
                selectingToken,
                setSelectingToken,
                fromToken,
                setFromToken,
                toToken,
                setToToken
            }}
        >
            {children}
        </SingularityIndexPageContext.Provider>
    )
}

const useSingularityData = () => {
    return useContext(SingularityIndexPageContext)
}

export default useSingularityData
