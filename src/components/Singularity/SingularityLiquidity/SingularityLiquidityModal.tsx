import { useEffect } from 'react'
import useSingularityLiquidity from '../../../hooks/useSingularityLiquidity'
import { commaFormatter, formatter, isNotEmpty, currentEpoch } from '../../../utils'
import Button from '../../Button'
import DataPoint from '../../DataPoint'
import LiveTime from '../../LiveTime'
import Modal from '../../Modal'
import SwapperInput from '../SwapperInput'

export default function SingularityLiquidityModal() {
    const {
        status,
        selectedLp,
        setSelectedLp,
        lpInput,
        setLpInput,
        isWithdraw,
        setIsWithdraw,
        slippageTolerance,
        setSlippageTolerance,
        withdrawFee,
        depositReward,
        withdrawLp,
        depositLp,
        mintTestToken
    } = useSingularityLiquidity()

    const actionVerb = `${isWithdraw ? 'withdraw' : 'deposit'}`

    return (
        <>
            <Modal visible={selectedLp} onClose={() => setSelectedLp(null)}>
                <div className="space-y-6">
                    <div className="flex items-center">
                        <p className="flex-1 text-2xl font-medium">
                            {isWithdraw ? 'Withdraw' : 'Deposit'}
                        </p>

                        <button
                            onClick={() => setIsWithdraw((_) => !_)}
                            className="underline text-sm opacity-50 hover:opacity-100 animate transition-all"
                        >
                            {isWithdraw ? 'Deposit Instead' : 'Withdraw Instead'}
                        </button>
                    </div>

                    <div>
                        {!isWithdraw && (
                            <>
                                <DataPoint
                                    title={`Wallet Balance`}
                                    value={`${formatter(selectedLp?.walletBalance)} ${
                                        selectedLp?.symbol
                                    }`}
                                />

                                <DataPoint
                                    title={`${selectedLp?.symbol} Price`}
                                    value={`$${formatter(selectedLp?.tokenPrice)}`}
                                />

                                <DataPoint
                                    title={`Reward`}
                                    value={`${formatter(depositReward)} ${selectedLp?.symbol}`}
                                />
                            </>
                        )}

                        {isWithdraw && (
                            <>
                                <DataPoint
                                    title={`Wallet LP Balance`}
                                    value={`${formatter(selectedLp?.lpBalance.walletBalance)} LP`}
                                />
                            </>
                        )}

                        <DataPoint
                            title="Last Updated"
                            value={
                                <>
                                    <LiveTime date={selectedLp?.lastUpdated} /> seconds ago
                                </>
                            }
                        />

                        <DataPoint
                            title="Collateralization Ratio"
                            value={`${commaFormatter(selectedLp?.collatRatio)}`}
                        />

                        <DataPoint
                            title="Assets"
                            value={`${commaFormatter(selectedLp?.assetAmount)}`}
                        />

                        <DataPoint
                            title="Liabilities"
                            value={`${commaFormatter(selectedLp?.liabilityAmount)}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="opacity-50 font-medium">
                            How much {selectedLp?.symbol} would you like to {actionVerb}?
                        </p>
                        <SwapperInput
                            value={lpInput}
                            onChange={(e) => setLpInput(e.target.value)}
                            buttonContent={
                                <span className="flex items-center space-x-2">
                                    <img
                                        className="w-6"
                                        src={`/img/tokens/${selectedLp?.asset}`}
                                        alt=""
                                    />
                                    <span className="font-medium uppercase">
                                        {selectedLp?.symbol}
                                    </span>
                                </span>
                            }
                            footerLeft={
                                isNotEmpty(lpInput) &&
                                selectedLp?.tokenPrice &&
                                `$${formatter(lpInput * selectedLp?.tokenPrice)}`
                            }
                            footerRight={
                                isNotEmpty(selectedLp?.walletBalance) && (
                                    <button onClick={() => setLpInput(selectedLp?.walletBalance)}>
                                        Max: {formatter(selectedLp?.walletBalance)}{' '}
                                        {selectedLp?.symbol}
                                    </button>
                                )
                            }
                        />

                        <Button
                            className="w-full bg-neutral-800"
                            onClick={() => mintTestToken(selectedLp)}
                        >
                            Mint {1000} test{selectedLp?.symbol} Tokens
                        </Button>
                    </div>
                    <div>
                        <DataPoint
                            title={`Your Deposits`}
                            value={
                                <>
                                    <span className="space-x-2">
                                        <span>
                                            {formatter(
                                                selectedLp?.lpBalance.walletBalance *
                                                    selectedLp?.pricePerShare
                                            )}
                                        </span>
                                        <span>
                                            <i className="fas fa-caret-right"></i>
                                        </span>

                                        <span>
                                            {formatter(
                                                isWithdraw
                                                    ? selectedLp?.lpBalance.walletBalance *
                                                          selectedLp?.pricePerShare -
                                                          Number(lpInput) *
                                                              selectedLp?.pricePerShare
                                                    : selectedLp?.lpBalance.walletBalance *
                                                          selectedLp?.pricePerShare +
                                                          Number(lpInput) *
                                                              selectedLp?.pricePerShare
                                            )}
                                        </span>
                                        <span>{selectedLp?.symbol}</span>
                                    </span>
                                </>
                            }
                        />

                        {isWithdraw && (
                            <>
                                <DataPoint
                                    title={`Amount Withdrawn`}
                                    value={`${formatter(
                                        Number(lpInput) * selectedLp?.pricePerShare
                                    )}`}
                                />

                                <DataPoint title={`Fees`} value={`${formatter(withdrawFee)}`} />
                            </>
                        )}
                    </div>

                    {/* <div className="space-y-2">
                        <p>
                            How much {selectedLp?.symbol} would you like to {actionVerb}?
                        </p>
                        <Input
                            type="number"
                            value={lpInput}
                            onChange={(e) => setLpInput(e.target.value)}
                        />
                    </div> */}

                    <div className="flex space-x-6">
                        <Button onClick={() => setSelectedLp(null)} className="w-auto">
                            Cancel
                        </Button>
                        <Button
                            loading={status === 'loading'}
                            className="bg-gradient-to-br from-purple-900 to-blue-900"
                            onClick={
                                isWithdraw
                                    ? () => withdrawLp(lpInput, selectedLp)
                                    : () => depositLp(lpInput, selectedLp)
                            }
                        >
                            {isWithdraw ? 'Withdraw' : 'Deposit'} {selectedLp?.symbol}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
