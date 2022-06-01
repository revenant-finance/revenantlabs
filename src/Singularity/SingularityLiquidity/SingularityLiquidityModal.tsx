import { useEffect } from 'react'
import useSingularityLiquidity from '../hooks/useSingularityLiquidity'
import {
    commaFormatter,
    formatter,
    isNotEmpty,
    currentEpoch,
    smartNumberFormatter
} from '../../utils'
import Button from '../../components/Btns/Button'
import DataPoint from '../../components/DataPoint/DataPoint'
import LiveTime from '../../components/Countdown/LiveTime'
import Modal from '../../components/Modals/Modal'
import SwapperInput from '../SingularitySwap/SwapperInput'
import ConnectWalletFirstButton from '../../components/Btns/ConnectWalletFirstButton'

export default function SingularityLiquidityModal() {
    const {
        status,
        selectedLp,
        setSelectedLp,
        lpInput,
        setLpInput,
        isWithdrawal,
        setIsWithdraw,
        slippageTolerance,
        setSlippageTolerance,
        withdrawalFee,
        depositFee,
        withdrawLp,
        depositLp,
        mintTestToken,
        lpToUnderlying,
        underlyingToLp,
        isUnderlyingApproved,
        isLpApproved
    } = useSingularityLiquidity()

    const actionVerb = `${isWithdrawal ? 'withdraw' : 'deposit'}`

    return (
        <>
            <Modal visible={selectedLp} onClose={() => setSelectedLp(null)}>
                <div className="space-y-6">
                    <div className="flex items-center">
                        <p className="flex-1 text-2xl font-medium">
                            {isWithdrawal ? 'Withdraw' : 'Deposit'}
                        </p>

                        <button
                            onClick={() => setIsWithdraw((_) => !_)}
                            className="text-sm underline transition-all opacity-50 hover:opacity-100 animate"
                        >
                            {isWithdrawal ? 'Deposit Instead' : 'Withdraw Instead'}
                        </button>
                    </div>

                    <div>
                        {!isWithdrawal && (
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
                                    value={`${formatter(depositFee)} ${selectedLp?.symbol}`}
                                />
                            </>
                        )}

                        {isWithdrawal && (
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
                        <DataPoint
                            title="Price Per Share"
                            value={`${smartNumberFormatter(selectedLp?.pricePerShare)}`}
                        />
                        <DataPoint
                            title="Deposit Cap"
                            value={`${smartNumberFormatter(selectedLp?.depositCap)} ${
                                selectedLp?.symbol
                            }`}
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
                                        {isWithdrawal && '-LP'}
                                    </span>
                                </span>
                            }
                            footerLeft={
                                isNotEmpty(lpInput) && selectedLp?.tokenPrice && isWithdrawal
                                    ? `${commaFormatter(lpToUnderlying(lpInput, selectedLp))} ${
                                          selectedLp.symbol
                                      }`
                                    : `$${commaFormatter(lpInput * selectedLp?.tokenPrice)}`
                            }
                            footerRight={
                                <button
                                    className="hover:underline"
                                    onClick={() =>
                                        isWithdrawal
                                            ? setLpInput(selectedLp?.lpBalance.walletBalance)
                                            : setLpInput(selectedLp?.walletBalance)
                                    }
                                >
                                    Max:{' '}
                                    {isWithdrawal
                                        ? `${commaFormatter(selectedLp?.lpBalance.walletBalance)} ${
                                              selectedLp?.symbol
                                          }-LP`
                                        : `${commaFormatter(selectedLp?.walletBalance)} ${
                                              selectedLp?.symbol
                                          }`}
                                </button>
                            }
                        />

                        {/* <Button
                            className="w-full bg-neutral-800"
                            onClick={() => mintTestToken(selectedLp)}
                        >
                            Mint {1000} test{selectedLp?.symbol} Tokens
                        </Button> */}
                    </div>
                    <div>
                        <DataPoint
                            title={`Your Deposits`}
                            value={
                                <>
                                    <span className="space-x-2">
                                        <span>
                                            {smartNumberFormatter(
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
                                            {smartNumberFormatter(
                                                isWithdrawal
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

                        {!isWithdrawal && (
                            <DataPoint
                                title={'Deposit Fee'}
                                value={`${depositFee ? depositFee : '0'} ${selectedLp?.symbol}`}
                            />
                        )}

                        {isWithdrawal && (
                            <DataPoint
                                title={`Withdrawal Fee`}
                                value={`${formatter(withdrawalFee)} ${selectedLp?.symbol}`}
                            />
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
                        <ConnectWalletFirstButton type="singularity">
                            <Button
                                loading={status === 'loading'}
                                className="bg-gradient-to-br from-purple-900 to-blue-900"
                                onClick={
                                    isWithdrawal
                                        ? () => withdrawLp(lpInput, selectedLp)
                                        : () => depositLp(lpInput, selectedLp)
                                }
                            >
                                {isWithdrawal
                                    ? isLpApproved
                                        ? 'Withdraw'
                                        : 'Approve'
                                    : isUnderlyingApproved
                                    ? 'Deposit'
                                    : 'Approve'}{' '}
                                {isWithdrawal ? `${selectedLp?.symbol}-LP` : selectedLp?.symbol}
                            </Button>
                        </ConnectWalletFirstButton>
                    </div>
                </div>
            </Modal>
        </>
    )
}
