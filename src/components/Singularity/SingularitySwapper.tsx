import { useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useAuth from '../../hooks/useAuth'
import useSingularitySwapper from '../../hooks/useSingularitySwapper'
import { commaFormatter, currentEpoch, isNotEmpty } from '../../utils'
import Button from '../Button'
import LiveTime from '../LiveTime'
import SwapperInput from './SwapperInput'
import SwapperModal from './SwapperModal'

export default function SingularitySwapper() {
    const { account } = useActiveWeb3React()
    const { login } = useAuth()
    const {
        status,
        showDetails,
        setShowDetails,
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
        isApproved
    } = useSingularitySwapper()

    const isReady = !!fromToken && !!toToken && !!fromValue && !!toValue

    return (
        <>
            <SwapperModal />

            <div className="relative w-full max-w-lg mx-auto space-y-4">
                <div className="w-full p-6 space-y-4 border-2 shadow-2xl bg-opacity-75 bg-neutral-900 border-neutral-800 rounded-xl">
                    <div>
                        {/* ======= FROM MODAL INPUTS =======  */}
                        <SwapperInput
                            className="mb-2"
                            onChange={(e) => setFromValue(e.target.value)}
                            value={fromValue}
                            onClick={() => openModal('from')}
                            buttonContent={
                                <>
                                    {fromToken && (
                                        <span className="flex items-center space-x-2">
                                            <img
                                                className="w-6"
                                                src={`/img/tokens/${fromToken.asset}`}
                                                alt=""
                                            />
                                            <span className="font-medium uppercase">
                                                {fromToken.symbol}
                                            </span>
                                            <i className="fas fa-caret-down opacity-25" />
                                        </span>
                                    )}
                                    {!fromToken && (
                                        <span className="flex items-center space-x-2">
                                            <p className="opacity-50">Select Token</p>
                                            <i className="fas fa-caret-down opacity-25" />
                                        </span>
                                    )}
                                </>
                            }
                            footerLeft={
                                isNotEmpty(fromValue) &&
                                fromToken?.tokenPrice &&
                                `$${formatter(fromValue * fromToken?.tokenPrice)}`
                            }
                            footerRight={
                                isNotEmpty(fromToken?.walletBalance) && (
                                    <button onClick={() => setFromValue(fromToken?.walletBalance)}>
                                        Max: {formatter(fromToken?.walletBalance)}{' '}
                                        {fromToken?.symbol}
                                    </button>
                                )
                            }
                        />

                        {/* ======= SWAP INPUTS BUTTON =======  */}
                        <div className="h-0 relative flex items-center ml-6 md:ml-0 md:justify-center">
                            <button
                                onClick={swapTokens}
                                className="group absolute rounded-full w-8 md:w-12 h-8 md:h-12 md:text-lg flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 shadow"
                            >
                                <i className="transition group-hover:rotate-180 duration-300 fas fa-retweet" />
                            </button>
                        </div>
                        {/* ======= TO MODAL INPUTS =======  */}

                        <SwapperInput
                            readOnly
                            onChange={(e) => setToValue(e.target.value)}
                            value={toValue}
                            onClick={() => openModal('to')}
                            buttonContent={
                                <>
                                    {toToken && (
                                        <span className="flex items-center space-x-2">
                                            <img
                                                className="w-6"
                                                src={`/img/tokens/${toToken.asset}`}
                                                alt=""
                                            />
                                            <span className="font-medium uppercase">
                                                {toToken.symbol}
                                            </span>
                                            <i className="fas fa-caret-down opacity-25" />
                                        </span>
                                    )}
                                    {!toToken && (
                                        <span className="flex items-center space-x-2">
                                            <p className="opacity-50">Select Token</p>
                                            <i className="fas fa-caret-down opacity-25" />
                                        </span>
                                    )}
                                </>
                            }
                            footerLeft={
                                isNotEmpty(toValue) &&
                                toToken?.tokenPrice &&
                                `$${formatter(toValue * toToken?.tokenPrice)}`
                            }
                            footerRight={
                                isNotEmpty(toToken?.walletBalance) && (
                                    <button onClick={() => setFromValue(toToken?.walletBalance)}>
                                        Max: {formatter(toToken?.walletBalance)} {toToken?.symbol}
                                    </button>
                                )
                            }
                        />
                    </div>

                    {!showDetails && isReady && (
                        <button
                            onClick={() => setShowDetails((_) => !_)}
                            className="text-left w-full flex items-center justify-center p-4 font-mono text-sm border-2 border-neutral-800 bg-opacity-50 bg-neutral-900 rounded-xl"
                        >
                            <p className="flex-1">
                                1 {toToken.symbol} = {commaFormatter(fromValue / toValue)}{' '}
                                {fromToken.symbol}
                            </p>
                            <p>
                                <i className="fas fa-caret-down" />
                            </p>
                        </button>
                    )}

                    {showDetails && isReady && (
                        <>
                            {/* ======= FEE SUMMARY =======  */}
                            <button
                                onClick={() => setShowDetails((_) => !_)}
                                className="text-left w-full p-4 space-y-2 border-2 border-neutral-800 bg-opacity-75 bg-neutral-900 rounded-xl"
                            >
                                <div className="space-y-1">
                                    {/* <div className="flex items-center text-xs">
                                    <p className="flex-1">Slippage</p>
                                    <Input
                                        type="number"
                                        value={slippageTolerance}
                                        onChange={(e) => setSlippageTolerance(e.target.value)}
                                        onMax={() => setSlippageTolerance(100)}
                                    />
                                </div> */}
                                    <div className="font-mono flex items-center text-sm opacity-50">
                                        <p className="flex-1">Last Updated</p>
                                        <p className="">
                                            <LiveTime date={fromToken?.lastUpdated} /> seconds ago
                                        </p>
                                    </div>
                                    <div className="font-mono flex items-center text-sm opacity-50">
                                        <p className="flex-1">Price Impact</p>
                                        <p className="">{formatter(priceImpact)}%</p>
                                    </div>
                                    <div className="font-mono flex items-center text-sm opacity-50">
                                        <p className="flex-1">Total Fees</p>
                                        <p className="">
                                            ${String(commaFormatter(totalFees.toFixed(2)))} USD
                                        </p>
                                    </div>
                                    <div className="font-medium text-lg flex items-center text-transparent bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text">
                                        <p className="flex-1">Minimum Received</p>
                                        <p className="">
                                            ~{Number(minimumReceived).toFixed(8)} {toToken.symbol}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </>
                    )}

                    {isReady && (
                        <Button
                            loading={status === 'loading'}
                            onClick={account ? () => swap() : () => login()}
                            className="bg-gradient-to-br from-purple-900 to-blue-900 shadow"
                        >
                            {account
                                ? `${
                                      isApproved
                                          ? `Swap ${fromToken?.symbol}`
                                          : `Approve ${fromToken?.symbol}`
                                  }`
                                : 'Connect Wallet'}
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}
