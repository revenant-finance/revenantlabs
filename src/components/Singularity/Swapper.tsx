import classNames from 'classnames'
import { useActiveWeb3React } from '../../hooks'
import Input from '../Input'
import SwapperModal from './SwapperModal'
import useAuth from '../../hooks/useAuth'
import useSingularity from '../../hooks/useSingularity'
import { commaFormatter, currentEpoch } from '../../utils'

export default function () {
    const { account, library } = useActiveWeb3React()
    const { login } = useAuth()
    const {
        openModal,
        fromToken,
        toToken,
        fromValue,
        setFromValue,
        toValue,
        setToValue,
        slippageTolerance,
        setSlippageTolerance,
        swapTokens,
        maxFrom,
        formatter,
        totalFees,
        minimumReceived,
        swap,
        priceImpact,
    } = useSingularity()

    return (
        <>
            <SwapperModal />

            <div className="relative w-full max-w-md mx-auto space-y-4">
                <div className="p-6 space-y-3 border-2 shadow-2xl bg-neutral-900 border-neutral-800 rounded-2xl">
                    <div className="relative overflow-hidden border-2 rounded-2xl border-neutral-800">
                        <div className="flex w-full border-b-2 bg-neutral-700 border-neutral-800 ">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    className={classNames(
                                        'bg-transparent outline-none p-4 w-full',
                                        !!fromToken?.walletBalance && 'pb-0'
                                    )}
                                    onChange={(e) => setFromValue(e.target.value)}
                                    value={fromValue}
                                />

                                {!!fromToken?.walletBalance && (
                                    <button onClick={maxFrom} className="px-4 pb-2 text-xs">
                                        Max: {formatter(fromToken.walletBalance)} {fromToken.symbol}
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => openModal('from')}
                                type="button"
                                className="flex items-center justify-center px-3 space-x-2"
                            >
                                <div className="flex items-center w-full max-w-lg px-3 py-2 space-x-2 border-2 shadow-2xl bg-neutral-800 border-neutral-900 rounded-2xl whitespace-nowrap">
                                    {fromToken && (
                                        <span className="flex items-center space-x-2">
                                            <img
                                                className="w-6"
                                                src={`/img/tokens/${fromToken.asset}`}
                                                alt=""
                                            />
                                            {/* <span>{fromToken.symbol}</span> */}
                                        </span>
                                    )}
                                    {!fromToken && (
                                        <i className="fas fa-box hover:animate-spin"></i>
                                    )}
                                </div>
                            </button>
                        </div>

                        <div className="relative z-10 w-full pointer-events-none">
                            <button
                                onClick={swapTokens}
                                className="block w-8 h-8 ml-auto mr-6 -mt-4 -mb-4 border-2 rounded-full pointer-events-auto md:mx-auto md:h-10 md:w-10 bg-neutral-800 border-neutral-900 md:-mt-5 md:-mb-5"
                            >
                                <i className="fas fa-retweet" />
                            </button>
                        </div>

                        <div className="flex w-full bg-neutral-700">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    className={classNames(
                                        'bg-transparent outline-none p-4 w-full',
                                        !!toToken?.walletBalance && 'pb-0'
                                    )}
                                    value={toValue}
                                    onChange={(e) => setToValue(e.target.value)}
                                    disabled={true}
                                />
                                {/* {!!toToken?.walletBalance && (
                                    <button onClick={maxTo} className="px-4 pb-2 text-xs">
                                        Max: {formatter(toToken?.walletBalance)} {toToken.symbol}
                                    </button>
                                )} */}
                            </div>
                            <button
                                onClick={() => openModal('to')}
                                type="button"
                                className="flex items-center justify-center px-3"
                            >
                                <div className="flex items-center w-full max-w-lg px-3 py-2 space-x-2 border-2 shadow-2xl bg-neutral-800 border-neutral-900 rounded-2xl whitespace-nowrap">
                                    {toToken && (
                                        <span className="flex items-center space-x-2">
                                            <img
                                                className="w-6"
                                                src={`/img/tokens/${toToken.asset}`}
                                                alt=""
                                            />
                                            {/* <span>{toToken.symbol}</span> */}
                                        </span>
                                    )}
                                    {!toToken && <i className="fas fa-box hover:animate-spin"></i>}
                                </div>
                            </button>
                        </div>
                    </div>

                    {!!fromToken && !!toToken && !!fromValue && !!toValue && (
                        <div className="p-4 space-y-2 font-mono border-2 border-neutral-800 bg-neutral-700 rounded-2xl">
                            <p className="text-xs font-extrabold">Operation Receipt</p>

                            <div className="flex p-2 space-x-4 rounded bg-neutral-800">
                                <div className="whitespace-nowrap">
                                    <p className="text-xs opacity-50">From</p>
                                    <p className="">
                                        {formatter(fromValue)} {fromToken.symbol}
                                    </p>
                                    <p className="">${commaFormatter((Number(fromValue) * fromToken.tokenPrice).toFixed(2))}</p>
                                </div>

                                <div className="flex items-center justify-center flex-1">
                                    <i className="fas fa-circle-arrow-right"></i>
                                </div>
                                <div className=" whitespace-nowrap">
                                    <p className="text-xs opacity-50">To</p>

                                    <p className="">
                                        {formatter(toValue)} {toToken.symbol}
                                    </p>
                                    <p className="">${commaFormatter((Number(toValue) * toToken.tokenPrice).toFixed(2))}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center text-xs">
                                    <p className="flex-1">Slippage</p>
                                    <Input
                                        type="number"
                                        value={slippageTolerance}
                                        onChange={(e) => setSlippageTolerance(e.target.value)}
                                        onMax={() => setSlippageTolerance(100)}
                                    />
                                    {/* <p className="">0.1%</p> */}
                                </div>
                                <div className="flex items-center text-xs">
                                    <p className="flex-1">Price Impact</p>
                                    <p className="">~{formatter(priceImpact)}%</p>
                                </div>
                                <div className="flex items-center text-xs">
                                    <p className="flex-1">Total Fees</p>
                                    <p className="">
                                        ${String(commaFormatter(totalFees.toFixed(2)))} USD
                                    </p>
                                </div>
                                <div className="flex items-center text-xs">
                                    <p className="flex-1">Last Updated</p>
                                    <p className="">
                                        {(currentEpoch - fromToken.lastUpdated).toFixed(0)} Seconds
                                    </p>
                                </div>
                                <div className="flex items-center text-purple-400">
                                    <p className="flex-1">Minimum Received</p>
                                    <p className="">
                                        ~{formatter(minimumReceived)} {toToken.symbol}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            onClick={account ? () => swap() : () => login()}
                            className="w-full px-2 py-2 font-medium text-purple-400 bg-purple-900 rounded"
                        >
                            {account ? 'Swap' : 'Connect Wallet'}
                        </button>
                    </div>

                    {fromToken && toToken && (
                        <p className="font-mono text-xs text-center opacity-50">
                            Swapping {formatter(fromValue || 0)} {fromToken.symbol} to{' '}
                            {formatter(toValue || 0)} {toToken.symbol}.
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
