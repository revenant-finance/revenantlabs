import { BigNumberInput } from 'big-number-input'
import classNames from 'classnames'
import { useWallet } from 'use-wallet'
import useSingularityData from './SingularityAppWrapper'
import SwapperModal from './SwapperModal'

export default function () {
    const wallet = useWallet()
    const { openModal, fromToken, toToken, fromValue, setFromValue, toValue, setToValue, slippage, setSlippage, swapTokens, fromBalanceEth, toBalanceEth, maxFrom, maxTo, inEth, formatter } = useSingularityData()

    return (
        <>
            <SwapperModal />

            <div className="relative max-w-md mx-auto w-full space-y-4">
                <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-zinc-800">
                        <div className="bg-zinc-700 w-full flex border-b-2 border-zinc-800 ">
                            <div className="flex-1">
                                <BigNumberInput
                                    renderInput={(props) => <input {...props} className={classNames('bg-transparent outline-none p-4 w-full', !!fromBalanceEth && 'pb-0')} />}
                                    decimals={fromToken ? fromToken.decimals : 18}
                                    value={fromValue}
                                    onChange={(value) => setFromValue(value)}
                                />
                                {!!fromBalanceEth && (
                                    <button onClick={maxFrom} className="px-4 text-xs pb-2">
                                        Max: {formatter(fromBalanceEth)} {fromToken.symbol}
                                    </button>
                                )}
                            </div>
                            <button onClick={() => openModal('from')} type="button" className="flex items-center justify-center space-x-2 px-3">
                                <div className="bg-zinc-800 max-w-lg w-full border-2 border-zinc-900 rounded-2xl shadow-2xl px-3 py-2 whitespace-nowrap flex items-center space-x-2">
                                    {fromToken && (
                                        <span className="flex items-center space-x-2">
                                            <img className="w-6" src={fromToken.image} alt="" />
                                            <span>{fromToken.symbol}</span>
                                        </span>
                                    )}
                                    {!fromToken && (
                                        <span>
                                            <i className="fas fa-box hover:animate-spin"></i>
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>

                        <div className="w-full relative z-10 pointer-events-none">
                            <button onClick={swapTokens} className="pointer-events-auto block ml-6 md:mx-auto h-10 w-10 bg-neutral-700 border-2 border-neutral-800 -mt-5 -mb-5 rounded-full">
                                <i className="fas fa-retweet" />
                            </button>
                        </div>

                        <div className="bg-zinc-700 w-full flex">
                            <div className="flex-1">
                                <BigNumberInput
                                    renderInput={(props) => <input {...props} className={classNames('bg-transparent outline-none p-4 w-full', !!toBalanceEth && 'pb-0')} />}
                                    decimals={toToken ? toToken.decimals : 18}
                                    value={toValue}
                                    onChange={(value) => setToValue(value)}
                                />
                                {!!toBalanceEth && (
                                    <button onClick={maxTo} className="px-4 text-xs pb-2">
                                        Max: {formatter(toBalanceEth)} {toToken.symbol}
                                    </button>
                                )}
                            </div>
                            <button onClick={() => openModal('to')} type="button" className="flex items-center justify-center  px-3">
                                <div className="bg-zinc-800 max-w-lg w-full border-2 border-zinc-900 rounded-2xl shadow-2xl px-3 py-2 whitespace-nowrap flex items-center space-x-2">
                                    {toToken && (
                                        <span className="flex items-center space-x-2">
                                            <img className="w-6" src={toToken.image} alt="" />
                                            <span>{toToken.symbol}</span>
                                        </span>
                                    )}
                                    {!toToken && (
                                        <span>
                                            <i className="fas fa-box hover:animate-spin"></i>
                                        </span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {!!fromToken && !!toToken && !!fromValue && !!toValue && (
                        <div className="border-2 border-zinc-800 bg-zinc-700 rounded-2xl font-mono p-4 space-y-2">
                            <p className="text-xs font-extrabold">Operation Receipt</p>

                            <div className="flex space-x-4 p-2 bg-zinc-800 rounded">
                                <div className="whitespace-nowrap">
                                    <p className="text-xs opacity-50">From</p>
                                    <p className="">
                                        {formatter(inEth(fromValue, fromToken.decimals))} {fromToken.symbol}
                                    </p>
                                </div>

                                <div className="flex-1 flex items-center justify-center">
                                    <i className="fas fa-circle-arrow-right"></i>
                                </div>
                                <div className=" whitespace-nowrap">
                                    <p className="text-xs opacity-50">To</p>

                                    <p className="">
                                        {formatter(inEth(toValue, toToken.decimals))} {toToken.symbol}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center text-xs">
                                    <p className="flex-1">Slippage</p>
                                    <input value={slippage} onChange={(e) => setSlippage(e.target.value)} type="number" className="bg-transparent text-right outline-none" />
                                    {/* <p className="">0.1%</p> */}
                                </div>
                                <div className="flex items-center text-xs">
                                    <p className="flex-1">Price Impact</p>
                                    <p className="">~0.2%</p>
                                </div>
                                <div className="flex items-center text-xs">
                                    <p className="flex-1">Total Fees</p>
                                    <p className="">~12.00 USDC</p>
                                </div>
                                <div className="flex items-center text-yellow-400">
                                    <p className="flex-1">Minimum Receieved</p>
                                    <p className="">~12.00 USDC</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button onClick={() => wallet.connect()} className="bg-purple-900 text-purple-400 w-full px-2 py-2 rounded font-medium">
                            {wallet.account ? 'Swap' : 'Connect Wallet'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
