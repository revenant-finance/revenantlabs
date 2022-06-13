import Button from '../Btns/Button'
import ConnectWalletFirstButton from '../Btns/ConnectWalletFirstButton'
import DataPoint from '../DataPoint/DataPoint'
import Modal from '../Modals/Modal'
import {
    commaFormatter,
    formatter, smartNumberFormatter
} from '../../utils'
import useSingularityLiquidity from '../../hooks/useLiquidity'
import SwapperInput from '../swap/SwapperInput'

export default function SingularityLiquidityModal() {
    const {
        status,
        setStatus,
        selectedLp,
        setSelectedLp,
        lpInput,
        setLpInput,
        isWithdrawal,
        setIsWithdrawal,
        slippageTolerance,
        setSlippageTolerance,
        withdrawalFee,
        depositFee,
        withdrawLp,
        depositLp,
        lpToUnderlying,
        isUnderlyingApproved,
        isLpApproved,
        withdrawalAmount
    } = useSingularityLiquidity()
    const actionVerb = `${isWithdrawal ? 'withdraw' : 'deposit'}`

    return (
        <>
            <Modal
                visible={selectedLp}
                onClose={() => {
                    setSelectedLp(null)
                    setLpInput(null)
                    setStatus('idle')
                }}
            >
                <div className="space-y-6">
                    <div className="flex items-center">
                        <p className="flex-1 text-2xl font-medium">
                            {isWithdrawal ? 'Withdraw' : 'Deposit'}
                        </p>

                        <button
                            onClick={() => {
                                setIsWithdrawal((_) => !_)
                                setLpInput(null)
                            }}
                            className="text-sm underline transition-all opacity-50 hover:opacity-100 animate"
                        >
                            {isWithdrawal ? 'Deposit Instead' : 'Withdraw Instead'}
                        </button>
                    </div>

                    <div>
                        {/* {!selectedLp?.isStablecoin && (
                            <>
                                <DataPoint
                                    title="Last Updated"
                                    value={
                                        <>
                                            <LiveTime date={selectedLp?.lastUpdated} /> seconds ago
                                        </>
                                    }
                                />
                            </>
                        )} */}
                        {!isWithdrawal && (
                            <DataPoint
                                title="Deposits"
                                value={`${commaFormatter(
                                    selectedLp?.liabilityAmount
                                )} / ${smartNumberFormatter(selectedLp?.depositCap)} ${
                                    selectedLp?.symbol
                                }`}
                            />
                        )}
                        <DataPoint
                            title="Assets"
                            value={`${commaFormatter(selectedLp?.assetAmount)}`}
                        />

                        <DataPoint
                            title="Liabilities"
                            value={`${commaFormatter(selectedLp?.liabilityAmount)}`}
                        />

                        <DataPoint
                            title="Collateralization Ratio"
                            value={`${commaFormatter(selectedLp?.collatRatio * 100, 1)}%`}
                        />

                        <DataPoint
                            title="Price Per Share"
                            value={`${smartNumberFormatter(selectedLp?.pricePerShare)}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium opacity-50">
                            How much{' '}
                            {isWithdrawal ? `${selectedLp?.symbol}-SPT` : selectedLp?.symbol} would
                            you like to {actionVerb}?
                        </p>
                        <SwapperInput
                            value={lpInput}
                            onChange={(e) =>
                                setLpInput(
                                    e.target.value,
                                    isWithdrawal ? selectedLp?.lpBalance.walletBalance : null
                                )
                            }
                            buttonContent={
                                <span className="flex items-center space-x-2">
                                    <img
                                        className="w-6"
                                        src={`/img/tokens/${selectedLp?.asset}`}
                                        alt=""
                                    />
                                    <span className="font-medium uppercase">
                                        {selectedLp?.symbol}
                                        {isWithdrawal && '-SPT'}
                                    </span>
                                </span>
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
                                    Balance:{' '}
                                    {isWithdrawal
                                        ? `${commaFormatter(selectedLp?.lpBalance.walletBalance)} ${
                                              selectedLp?.symbol
                                          }-SPT`
                                        : `${commaFormatter(selectedLp?.walletBalance)} ${
                                              selectedLp?.symbol
                                          }`}
                                </button>
                            }
                        />
                    </div>
                    <div>
                        {!isWithdrawal && (
                            <div>
                                <DataPoint
                                    title={'Deposit Fee'}
                                    value={`${formatter(depositFee ? depositFee : '0', 6)} ${
                                        selectedLp?.symbol
                                    }`}
                                />
                                <DataPoint
                                    title={`You Will Receive`}
                                    value={`${formatter(
                                        lpInput / selectedLp?.pricePerShare - depositFee,
                                        6
                                    )} ${selectedLp?.symbol}-SPT`}
                                />
                            </div>
                        )}

                        {isWithdrawal && (
                            <div>
                                <DataPoint
                                    title={`Withdrawal Fee`}
                                    value={`${formatter(withdrawalFee ? withdrawalFee : '0', 6)} ${
                                        selectedLp?.symbol
                                    }`}
                                />
                                <DataPoint
                                    title={`You Will Receive`}
                                    value={`${formatter(
                                        lpInput * selectedLp?.pricePerShare - withdrawalFee,
                                        6
                                    )} ${selectedLp?.symbol}`}
                                />
                            </div>
                        )}
                    </div>

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
                                        ? () => withdrawLp(lpInput, selectedLp, setLpInput)
                                        : () => depositLp(lpInput, selectedLp, setLpInput)
                                }
                            >
                                {isWithdrawal
                                    ? isLpApproved
                                        ? 'Withdraw'
                                        : 'Approve'
                                    : isUnderlyingApproved
                                    ? 'Deposit'
                                    : 'Approve'}{' '}
                                {isWithdrawal ? `${selectedLp?.symbol}-SPT` : selectedLp?.symbol}
                            </Button>
                        </ConnectWalletFirstButton>
                    </div>
                </div>
            </Modal>
        </>
    )
}
