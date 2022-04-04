import { useState } from 'react'
import useSingularitySwapper from '../../hooks/useSingularitySwapper'
import { formatter, isNotEmpty } from '../../utils'
import Modal from '../Modal'
import Portal from '../Portal'

export default function SwapperModal() {
    const {
        tokens,
        setFromToken,
        setToToken,
        showSelectTokenModal,
        setShowSelectTokenModal,
        selectingToken
    } = useSingularitySwapper()

    const [filter, setFilter] = useState('')

    const tokenList =
        tokens
            ?.filter((token) => {
                // Don't show selected tokens, if selected.
                // if (selectingToken === 'to') return fromToken ? token.id !== fromToken.id : true
                // if (selectingToken === 'from') return toToken ? token.id !== toToken.id : true
                return true
            })
            ?.filter((token) => {
                const matchesName = token.name.toLowerCase().startsWith(filter.toLowerCase())
                const matchesSymbol = token.symbol.toLowerCase().startsWith(filter.toLowerCase())
                const matchesAddress = token.address.toLowerCase().startsWith(filter.toLowerCase())

                if (matchesName || matchesSymbol || matchesAddress) return true
                return false
            }) || []

    const setToken = (token) => {
        if (selectingToken === 'from') setFromToken(token)
        if (selectingToken === 'to') setToToken(token)
        setShowSelectTokenModal(false)
    }

    return (
        <Portal>
            <Modal visible={showSelectTokenModal} onClose={() => setShowSelectTokenModal(false)}>
                <div className="flex flex-col">
                    {/* <Input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Name, Symbol, or Contract Address"
                    /> */}
                    <div className="flex-1 max-h-full overflow-auto">
                        {tokenList.map((token) => {
                            return (
                                <button
                                    key={token.id}
                                    onClick={() => setToken(token)}
                                    className="flex items-center w-full p-2 px-4 space-x-2 text-left hover:bg-neutral-800 transition-all rounded-xl"
                                >
                                    <img
                                        className="h-8 w-8 rounded-xl full"
                                        src={`/img/tokens/${token.asset}`}
                                        alt=""
                                    />
                                    <div className="flex w-full items-center">
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xl space-x-2 font-medium">
                                                <span>{token.name}</span>
                                                <span className="text-sm opacity-25">
                                                    ${formatter(token.tokenPrice)}
                                                </span>
                                            </p>
                                            <p className="space-x-1 text-xs">
                                                <span className="font-medium">{token.symbol}</span>
                                                <a
                                                    href={`https://ftmscan.com/address/${token.address}`}
                                                    target="_blank"
                                                    className="font-mono underline truncate opacity-50 hover:no-underline"
                                                >
                                                    {token.address.slice(0, 3)}...
                                                    {token.address.slice(-3)}
                                                </a>
                                            </p>
                                        </div>
                                        {isNotEmpty(token.walletBalance) && (
                                            <div className="opacity-50">{token.walletBalance}</div>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </Modal>
        </Portal>
    )
}
