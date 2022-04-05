import { useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useAuth from '../../hooks/useAuth'
import useSingularitySwapper from '../../hooks/useSingularitySwapper'
import { commaFormatter, currentEpoch, isNotEmpty } from '../../utils'
import Button from '../Button'
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
                <div className="w-full p-6 space-y-4 bg-opacity-75 border-2 shadow-2xl bg-neutral-900 border-neutral-800 rounded-xl">
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
                                            <i className="opacity-25 fas fa-caret-down" />
                                        </span>
                                    )}
                                    {!fromToken && (
                                        <span className="flex items-center space-x-2">
                                            <p className="opacity-50">Select Token</p>
                                            <i className="opacity-25 fas fa-caret-down" />
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
                                    <button onClick={() => setFromValue(fromToken?.walletBalance)} className="underline hover:no-underline">
                                        Max: {formatter(fromToken?.walletBalance)}{' '}
                                        {fromToken?.symbol}
                                    </button>
                            }
                        />

                        {/* ======= SWAP INPUTS BUTTON =======  */}
                        <div className="relative flex items-center h-0 ml-6 md:ml-0 md:justify-center">
                            <button
                                onClick={swapTokens}
                                className="absolute flex items-center justify-center w-8 h-8 rounded-full shadow group md:w-12 md:h-12 md:text-lg bg-gradient-to-br from-purple-900 to-blue-900"
                            >
                                <i className="transition duration-300 group-hover:rotate-180 fas fa-retweet" />
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
                                            <i className="opacity-25 fas fa-caret-down" />
                                        </span>
                                    )}
                                    {!toToken && (
                                        <span className="flex items-center space-x-2">
                                            <p className="opacity-50">Select Token</p>
                                            <i className="opacity-25 fas fa-caret-down" />
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
                                    <div>
                                        Balance: {formatter(toToken?.walletBalance)} {toToken?.symbol}
                                    </div>
                            }
                        />
                    </div>

                    {!showDetails && isReady && (
                        <button
                            onClick={() => setShowDetails((_) => !_)}
                            className="flex items-center justify-center w-full p-4 font-mono text-sm text-left bg-opacity-50 border-2 border-neutral-800 bg-neutral-900 rounded-xl"
                        >
                            <p className="flex-1">
                                1 {toToken.symbol} = {commaFormatter(fromValue / toValue, 4)}{' '}
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
                                className="w-full p-4 space-y-2 text-left bg-opacity-75 border-2 border-neutral-800 bg-neutral-900 rounded-xl"
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
                                    <div className="flex items-center font-mono text-sm opacity-50">
                                        <p className="flex-1">Last Updated</p>
                                        <p className="">
                                            {formatter(fromToken?.lastUpdated - currentEpoch)}{' '}
                                            seconds ago
                                        </p>
                                    </div>
                                    <div className="flex items-center font-mono text-sm opacity-50">
                                        <p className="flex-1">Price Impact</p>
                                        <p className="">{formatter(priceImpact)}%</p>
                                    </div>
                                    <div className="flex items-center font-mono text-sm opacity-50">
                                        <p className="flex-1">Total Fees</p>
                                        <p className="">
                                            ${String(commaFormatter(totalFees.toFixed(2)))} USD
                                        </p>
                                    </div>
                                    <div className="flex items-center text-lg font-medium text-transparent bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text">
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
                            className="shadow bg-gradient-to-br from-purple-900 to-blue-900"
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
