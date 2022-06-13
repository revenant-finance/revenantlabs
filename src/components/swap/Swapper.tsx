import Button from '../Btns/Button'
import ConnectWalletFirstButton from '../Btns/ConnectWalletFirstButton'
import {
    formatter, isNotEmpty,
    smartNumberFormatter
} from '../../utils'
import useSingularitySwapper from '../../hooks/useSwapper'
import SwapperInput from './SwapperInput'
import SwapperModal from './SwapperModal'

export default function SingularitySwapper() {
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
        totalFees,
        minimumReceived,
        swap,
        priceImpact,
        isApproved,
        inFee,
        outFee,
        slippageIn,
        slippageOut,
        native,
        setNative
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
                                `$${formatter(fromValue * fromToken?.tokenPrice, 2)}`
                            }
                            footerRight={
                                <button
                                    onClick={() => setFromValue(fromToken?.walletBalance)}
                                    className="underline hover:no-underline"
                                >
                                    Balance: {formatter(fromToken?.walletBalance, 6)}
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
                            inputType="text"
                            value={smartNumberFormatter(toValue)}
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
                                `$${formatter(toValue * toToken?.tokenPrice, 2)}`
                            }
                            footerRight={<div>Balance: {formatter(toToken?.walletBalance, 6)}</div>}
                        />
                    </div>

                    {isReady && (
                        <button
                            onClick={() => setShowDetails((_) => !_)}
                            className="flex items-center justify-center w-full p-4 font-mono text-sm text-left bg-opacity-50 border-2 border-neutral-800 bg-neutral-900 rounded-xl"
                        >
                            <p className="flex-1">
                                1 {fromToken.symbol} = {smartNumberFormatter(toValue / fromValue)}{' '}
                                {toToken.symbol}
                            </p>
                            <p>
                                <i className="fas fa-caret-down" />
                            </p>
                        </button>
                    )}

                    {showDetails && isReady && (
                        <>
                            {/* ======= FEE SUMMARY =======  */}
                            <div className="w-full p-4 space-y-2 text-left bg-opacity-75 border-2 border-neutral-800 bg-neutral-900 rounded-xl">
                                <div className="flex items-center font-mono text-sm opacity-50">
                                    <p className="flex-1">Price per {fromToken?.symbol}</p>
                                    <p className="">
                                        {smartNumberFormatter(toValue / fromValue)}{' '}
                                        {toToken?.symbol} / {fromToken?.symbol}{' '}
                                    </p>
                                </div>
                                <div className="flex items-center font-mono text-sm opacity-50">
                                    <p className="flex-1">Price per {toToken?.symbol}</p>
                                    <p className="">
                                        {smartNumberFormatter(fromValue / toValue)}{' '}
                                        {fromToken?.symbol} / {toToken?.symbol}
                                    </p>
                                </div>
                                <div className="flex items-center font-mono text-sm">
                                    <p className="flex-1 opacity-50">Price Impact</p>
                                    <p
                                        className=""
                                        style={{
                                            color:
                                                priceImpact > 10 || toValue == 0
                                                    ? 'red'
                                                    : priceImpact > 5
                                                    ? 'yellow'
                                                    : 'springgreen'
                                        }}
                                    >
                                        <b>
                                            {toValue > 0
                                                ? `${formatter(priceImpact, 2)}%`
                                                : 'Infinity'}
                                        </b>
                                    </p>
                                </div>
                                {toValue > 0 && (
                                    <div className="flex items-center font-mono text-sm opacity-50">
                                        <p className="flex-1">Swap Fee</p>
                                        <p className="">${smartNumberFormatter(totalFees)}</p>
                                    </div>
                                )}
                                {toValue > 0 && (
                                    <div>
                                        <div className="flex items-center font-mono text-sm opacity-50">
                                            <p className="flex flex-1">Slippage</p>
                                            <p className="flex">
                                                {`${smartNumberFormatter(slippageTolerance)}%`}
                                                <img src="/img/pencil.svg" alt="" />
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-lg font-medium text-transparent bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text">
                                                <p className="flex-1">Minimum Received</p>
                                                <p className="">
                                                    ~{smartNumberFormatter(minimumReceived)}{' '}
                                                    {toToken.symbol}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {isReady && (
                        <ConnectWalletFirstButton type="singularity">
                            <Button
                                loading={status === 'loading'}
                                onClick={() => toValue > 0 && swap()}
                                className="shadow bg-gradient-to-br from-purple-900 to-blue-900"
                            >
                                {toValue > 0
                                    ? isApproved
                                        ? `Swap ${fromToken?.symbol} for ${toToken?.symbol}`
                                        : `Approve ${fromToken?.symbol}`
                                    : 'Price Impact Too High'}
                            </Button>
                        </ConnectWalletFirstButton>
                    )}
                </div>
            </div>
        </>
    )
}
