import { useState } from 'react'
import useSingularitySwapper from '../hooks/useSingularitySwapper'
import { formatter, isNotEmpty } from '../../utils'
import Modal from '../../components/Modals/Modal'
import Portal from '../../components/Modals/Portal'

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
        addToken
    } = useSingularitySwapper()

    const [filter, setFilter] = useState('')

    const tokenList =
        tokens?.filter((token) => {
            if (fromToken) {
                if (token.id == fromToken.id) return false
            }
            if (toToken) {
                if (token.id == toToken.id) return false
            }
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
                                    onClick={(e) => {
                                        if (e.target.toString().includes("HTMLParagraphElement")) {
                                            setToken(token)
                                        }
                                    }}
                                    className="flex items-center w-full p-2 px-4 space-x-2 text-left transition-all hover:bg-neutral-800 rounded-xl"
                                >
                                    <img
                                        className="w-8 h-8 rounded-xl full"
                                        src={`/img/tokens/${token.asset}`}
                                        alt=""
                                    />
                                    <div className="flex items-center w-full">
                                        <div className="flex-1 overflow-hidden">
                                            <p className="space-x-2 text-xl font-medium">
                                                <span>{token.name}</span>
                                                <span className="text-sm opacity-25">
                                                    ${formatter(token.tokenPrice)}
                                                </span>
                                            </p>
                                            <p className="flex space-x-1 text-xs">
                                                <a
                                                    href={`https://ftmscan.com/token/${token.address}`}
                                                    target="_blank"
                                                    className="font-mono underline truncate opacity-50 hover:no-underline"
                                                >
                                                    {token.address.slice(0, 6)}...
                                                    {token.address.slice(-4)}
                                                </a>
                                                
                                                <img
                                                    src={`/img/add.svg`}
                                                    alt=""
                                                    onClick={() => addToken(token)}
                                                />
                                            </p>
                                        </div>
                                        <div className="opacity-75">
                                            {formatter(token.walletBalance)}
                                        </div>
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
