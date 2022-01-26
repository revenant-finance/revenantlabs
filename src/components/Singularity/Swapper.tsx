import useSingularityData from './SingularityAppWrapper'
import SwapperModal from './SwapperModal'

export default function () {
    const { openModal, fromToken, toToken } = useSingularityData()

    return (
        <>
            <SwapperModal />

            <div className="relative max-w-lg mx-auto w-full space-y-4">
                {/* <div className="flex items-center">
                    <p className="font-mono flex-1">Swap Tokens</p>
                    <button>
                        <i className="fas fa-cog" />
                    </button>
                </div> */}
                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6">
                    <div className="relative">
                        <div className="bg-neutral-700 rounded-t-3xl w-full border-b-2 border-neutral-800 flex">
                            <input autoFocus type="text" className="bg-transparent outline-none p-4 w-full" />
                            <button onClick={() => openModal('from')} type="button" className="flex items-center justify-center space-x-2 px-3">
                                <div className="bg-purple-400 text-purple-900 px-3 py-1 rounded-3xl whitespace-nowrap shadow">
                                    <span>{fromToken ? fromToken.symbol : 'Token'} </span>
                                    <span>
                                        <i className="fas fa-angle-down hover:animate-spin"></i>
                                    </span>
                                </div>
                            </button>
                        </div>

                        <div className="w-full relative z-10 pointer-events-none">
                            <button className="pointer-events-auto block ml-6 md:mx-auto h-10 w-10 bg-neutral-700 border-2 border-neutral-800 -mt-5 -mb-5 rounded-full">
                                <i className="fas fa-retweet" />
                            </button>
                        </div>

                        <div className="bg-neutral-700 rounded-b-3xl w-full flex">
                            <input type="text" className="bg-transparent outline-none p-4 w-full" />
                            <button onClick={() => openModal('to')} type="button" className="flex items-center justify-center space-x-2 px-3">
                                <div className="bg-purple-400 text-purple-900 px-3 py-1 rounded-3xl whitespace-nowrap shadow">
                                    <span>{toToken ? toToken.symbol : 'Token'} </span>
                                    <span>
                                        <i className="fas fa-angle-down hover:animate-spin"></i>
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <button className="bg-purple-300 text-purple-600 w-full px-2 py-2 rounded-3xl text-xl font-light">Connect Wallet</button>
                    </div>
                </div>
            </div>
        </>
    )
}
