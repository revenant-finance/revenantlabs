import { useState } from 'react'
import { TOKENS } from '../../data/constants'
import Modal from '../Modal'
import Portal from '../Portal'
import useSingularityData from './SingularityAppWrapper'

export default function SwapperModal() {
    const { fromToken, toToken, setFromToken, setToToken, showSelectTokenModal, setShowSelectTokenModal, selectingToken, setSelectingToken } = useSingularityData()

    const [filter, setFilter] = useState('')

    const tokenList = TOKENS['250']
        .filter((token) => {
            // Don't show selected tokens, if selected.
            return (fromToken ? token.id !== fromToken.id : true) && (toToken ? token.id !== toToken.id : true)
        })
        .filter((token) => {
            const matchesName = token.name.toLowerCase().startsWith(filter.toLowerCase())
            const matchesSymbol = token.symbol.toLowerCase().startsWith(filter.toLowerCase())
            const matchesAddress = token.address.toLowerCase().startsWith(filter.toLowerCase())

            if (matchesName || matchesSymbol || matchesAddress) return true
            return false
        })

    const setToken = (token) => {
        if (selectingToken === 'from') setFromToken(token)
        if (selectingToken === 'to') setToToken(token)
        setShowSelectTokenModal(false)
    }

    return (
        <Portal>
            <Modal visible={showSelectTokenModal} onClose={() => setShowSelectTokenModal(false)}>
                <div className="flex flex-col">
                    <div className="bg-neutral-700 rounded w-full flex">
                        <input autoFocus value={filter} onChange={(e) => setFilter(e.target.value)} type="text" placeholder="Name, Symbol, or Contract Address" className="outline-none bg-transparent p-2 w-full" />
                    </div>
                    <div className="max-h-full overflow-auto flex-1">
                        {tokenList.map((token) => (
                            <button onClick={() => setToken(token)} className="w-full text-left flex items-center space-x-4 hover:bg-neutral-900 p-2 px-4 rounded-xl">
                                <img className="w8 h-8 rounded full" src={token.image} alt="" />
                                <div className="overflow-hidden flex-1">
                                    <p>{token.name}</p>
                                    <p className="font-mono text-xs space-x-1">
                                        <span>{token.symbol}</span>
                                        <a href={`https://ftmscan.com/address/${token.address}`} target="_blank" className="opacity-50 truncate underline hover:no-underline">
                                            {token.address.slice(0, 6)}...{token.address.slice(-6)}
                                        </a>
                                    </p>
                                </div>
                                <div className="opacity-50">0.0</div>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </Portal>
    )
}
