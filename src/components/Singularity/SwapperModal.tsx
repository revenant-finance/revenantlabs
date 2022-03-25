import { useState } from 'react'
import useSingularity from '../../hooks/useSingularity'
import Input from '../Input'
import Modal from '../Modal'
import Portal from '../Portal'

export default function SwapperModal() {
    const {
        tokens,
        fromToken,
        toToken,
        setFromToken,
        setToToken,
        showSelectTokenModal,
        setShowSelectTokenModal,
        selectingToken,
        inEth,
        setSelectingToken
    } = useSingularity()

    const [filter, setFilter] = useState('')

    const tokenList = tokens
        .filter((token) => {
            // Don't show selected tokens, if selected.
            // if (selectingToken === 'to') return fromToken ? token.id !== fromToken.id : true
            // if (selectingToken === 'from') return toToken ? token.id !== toToken.id : true
            return true
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
                    <Input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Name, Symbol, or Contract Address"
                    />
                    <div className="flex-1 max-h-full overflow-auto">
                        {tokenList.map((token) => {
                            return (
                                <button
                                    key={token.id}
                                    onClick={() => setToken(token)}
                                    className="flex items-center w-full p-2 px-4 space-x-4 text-left hover:bg-neutral-900 rounded-xl"
                                >
                                    <img
                                        className="h-8 rounded w8 full"
                                        src={`/img/tokens/${token.asset}`}
                                        alt=""
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <p>{token.name}</p>
                                        <p className="space-x-1 font-mono text-xs">
                                            <span>{token.symbol}</span>
                                            <a
                                                href={`https://ftmscan.com/address/${token.address}`}
                                                target="_blank"
                                                className="underline truncate opacity-50 hover:no-underline"
                                            >
                                                {token.address.slice(0, 6)}...
                                                {token.address.slice(-6)}
                                            </a>
                                        </p>
                                    </div>
                                    {/* <div className="opacity-50">0.0</div> */}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </Modal>
        </Portal>
    )
}
