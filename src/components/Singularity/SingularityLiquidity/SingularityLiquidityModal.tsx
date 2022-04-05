import { useEffect } from 'react'
import useSingularityLiquidity from '../../../hooks/useSingularityLiquidity'
import { commaFormatter, formatter, isNotEmpty, currentEpoch } from '../../../utils'
import Button from '../../Button'
import DataPoint from '../../DataPoint'
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
        mintTestToken,
        lpToUnderlying,
        underlyingToLp
    } = useSingularityLiquidity()

    const actionVerb = `${isWithdraw ? 'withdraw' : 'deposit'}`

    return (
        <>
            <Modal visible={!!selectedLp} onClose={() => setSelectedLp(null)}>
                <div className="space-y-6">
                    <div className="flex items-center">
                        <p className="flex-1 text-2xl font-medium">
                            {isWithdraw ? 'Withdraw' : 'Deposit'}
                        </p>

                        <button
                            onClick={() => setIsWithdraw((_) => !_)}
                            className="text-sm underline transition-all opacity-50 hover:opacity-100 animate"
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
                            value={`${formatter(selectedLp?.lpBalance - currentEpoch)}
                            seconds ago`}
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
                        <DataPoint
                            title="Price Per Share"
                            value={`${commaFormatter(selectedLp?.pricePerShare)}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium opacity-50">
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
                                        {isWithdraw && '-LP'}
                                    </span>
                                </span>
                            }
                            footerLeft={
                                isNotEmpty(lpInput) && selectedLp?.tokenPrice && isWithdraw
                                    ? `${commaFormatter(lpToUnderlying(lpInput, selectedLp))} ${
                                          selectedLp.symbol
                                      }`
                                    : `$${commaFormatter(lpInput * selectedLp?.tokenPrice)}`
                            }
                            footerRight={
                                <button
                                    className="hover:underline"
                                    onClick={() =>
                                        isWithdraw
                                            ? setLpInput(selectedLp?.lpBalance.walletBalance)
                                            : setLpInput(selectedLp?.walletBalance)
                                    }
                                >
                                    Max:{' '}
                                    {isWithdraw
                                        ? `${commaFormatter(selectedLp?.lpBalance.walletBalance)} ${
                                              selectedLp?.symbol
                                          }-LP`
                                        : `${commaFormatter(selectedLp?.walletBalance)} ${
                                              selectedLp?.symbol
                                          }`}
                                </button>
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
                                            {commaFormatter(
                                                lpToUnderlying(
                                                    selectedLp?.lpBalance.walletBalance,
                                                    selectedLp
                                                )
                                            )}
                                        </span>
                                        <span>
                                            <i className="fas fa-caret-right"></i>
                                        </span>

                                        <span>
                                            {commaFormatter(
                                                isWithdraw
                                                    ? lpToUnderlying(
                                                          selectedLp?.lpBalance.walletBalance,
                                                          selectedLp
                                                      ) -
                                                          lpToUnderlying(
                                                              Number(lpInput),
                                                              selectedLp
                                                          )
                                                    : lpToUnderlying(
                                                          selectedLp?.lpBalance.walletBalance,
                                                          selectedLp
                                                      ) +
                                                          lpToUnderlying(
                                                              Number(lpInput),
                                                              selectedLp
                                                          )
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
