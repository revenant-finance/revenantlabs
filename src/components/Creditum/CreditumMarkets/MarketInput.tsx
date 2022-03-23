import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useCreditum from '../../../hooks/Creditum/useCreditum'
import useCreditumData from '../../../hooks/Creditum/useCreditumData'
import useAlerts from '../../../hooks/useAlerts'
import Button from '../../Button'
import ConnectWalletFirstButton from '../../ConnectWalletFirstButton'
import DataPoint from '../../DataPoint'
import Input from '../../Input'
import SlideOpen from '../../SlideOpen'

export default function MarketInput({ type }) {
    const {
        creditumData,
        selectedMarket,
        setSelectedMarket,
        depositInput,
        setDepositInput,
        borrowInput,
        setBorrowInput,
        repayInput,
        setRepayInput,
        withdrawInput,
        setWithdrawInput,
        showMoreInfo,
        setShowMoreInfo,
        showDepositTool,
        setShowDepositTool,
        showRepayTool,
        setShowRepayTool,
        liquidationPriceDeposit,
        setLiquidationPriceDeposit,
        healthDeposit,
        setHealthDeposit,
        borrowPercent,
        setBorrowPercent,
        newBorrowPercentDeposit,
        setNewBorrowPercentDeposit,
        liquidationPriceRepay,
        setLiquidationPriceRepay,
        healthRepay,
        setHealthRepay,
        newBorrowPercentRepay,
        setNewBorrowPercentRepay
    } = useCreditumData()
    const { enter, exit, stabilizerMint, stabilizerRedeem } = useCreditum()
    const { newAlert, clearAlert } = useAlerts()

    const isDeposit = type === 'repay'

    const [depositStatus, setDepositStatus] = useState('idle')
    const [withdrawStatus, setWithdrawStatus] = useState('idle')
    const [showTool, setShowTool] = useState(false)

    const onDeposit = () => {
        try {
            setDepositStatus('loading')
            newAlert({
                title: 'Depositing...',
                subtitle: `Depositing ${selectedMarket.symbol}... please complete the process with your wallet.`,
                type: 'info'
            })
            enter(
                selectedMarket,
                depositInput ? depositInput : '0',
                borrowInput ? borrowInput : '0'
            )
            newAlert({ title: 'Transaction Complete', subtitle: `Deposit complete.`, type: 'info' })
            setDepositStatus('idle')
        } catch (error) {
            setDepositStatus('error')
            newAlert({ title: 'Deposit Failed', subtitle: 'Please try again.', mood: 'negative' })
        }
    }

    const onRepay = () => {
        try {
            setWithdrawStatus('loading')
            newAlert({
                title: 'Repaying...',
                subtitle: `Repaying cUSD. Please complete the process with your wallet.`,
                type: 'info'
            })
            exit(selectedMarket, withdrawInput ? withdrawInput : '0', repayInput ? repayInput : '0')
            newAlert({
                title: 'Transaction Complete',
                subtitle: `Repayment complete.`,
                type: 'info'
            })
            setWithdrawStatus('idle')
        } catch (error) {
            setWithdrawStatus('error')
            newAlert({ title: 'Repayment Failed', subtitle: 'Please try again.', mood: 'negative' })
        }
    }

    const calculateWithdrawLimit = () => {
        const withdrawLimit = new BigNumber(selectedMarket.positionLiquidity)
            .plus(new BigNumber(repayInput))
            .div(selectedMarket.collateralMaxDebtRatio)
            .div(selectedMarket.priceUsd)
        return withdrawLimit
    }

    const calculateBorrowLimit = () => {
        const additionalLiquidity = new BigNumber(depositInput)
            .times(selectedMarket.collateralMaxDebtRatio * 100)
            .times(new BigNumber(selectedMarket.priceUsd))
            .div(100)

        const borrowLimit = new BigNumber(selectedMarket.positionLiquidity)
            .plus(additionalLiquidity)
            .toString()

        return borrowLimit
    }

    const onChangeAmountWithdraw = (e) => {
        const _amount = e.target.value
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) -
            Number(_amount) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) - Number(repayInput)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceRepay(_liquidationPrice)
        setHealthRepay(_health)
        setNewBorrowPercentRepay(_newBorrowPercent)
        setWithdrawInput(String(_amount))
    }

    const onChangeAmountRepay = (e) => {
        const _amount = e.target.value
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) -
            Number(withdrawInput) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) - Number(_amount)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceRepay(_liquidationPrice)
        setHealthRepay(_health)
        setNewBorrowPercentRepay(_newBorrowPercent)
        setRepayInput(String(_amount))
    }

    const handleMaxRepay = () => {
        const _amount =
            Number(creditumData.cusd.mintToken.walletBalance) > Number(selectedMarket.userDebt)
                ? selectedMarket.userDebt
                : creditumData.cusd.mintToken.walletBalance
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) -
            Number(withdrawInput) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) - Number(_amount)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceRepay(_liquidationPrice)
        setHealthRepay(_health)
        setNewBorrowPercentRepay(_newBorrowPercent)
        setRepayInput(String(_amount))
    }

    const handleMaxWithdraw = () => {
        const _amount = calculateWithdrawLimit()
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) -
            Number(withdrawInput) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) - Number(repayInput)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceRepay(_liquidationPrice)
        setHealthRepay(_health)
        setNewBorrowPercentRepay(_newBorrowPercent)
        setWithdrawInput((Number(_amount) * 0.99).toFixed(2))
    }

    const onChangeAmountDeposit = (e) => {
        const _amount = e.target.value
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) +
            Number(_amount) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) + Number(borrowInput)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceDeposit(_liquidationPrice)
        setHealthDeposit(_health)
        setNewBorrowPercentDeposit(_newBorrowPercent)
        setDepositInput(_amount)
    }

    const handleMaxDeposit = () => {
        const _amount = selectedMarket.walletBalance
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) +
            Number(_amount) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) + Number(borrowInput)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceDeposit(_liquidationPrice)
        setHealthDeposit(_health)
        setNewBorrowPercentDeposit(_newBorrowPercent)
        setDepositInput(String(_amount))
    }

    const onChangeAmountBorrow = (e) => {
        const _amount = e.target.value
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) +
            Number(depositInput) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) + Number(_amount)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceDeposit(_liquidationPrice)
        setHealthDeposit(_health)
        setNewBorrowPercentDeposit(_newBorrowPercent)
        setBorrowInput(String(_amount))
    }

    const handleMaxBorrow = () => {
        const _amount = calculateBorrowLimit()
        const _newCollateralValue =
            Number(selectedMarket.positionCollateralValue) +
            Number(depositInput) * selectedMarket.priceUsd
        const _newDebtValue = Number(selectedMarket.positionDebtValue) + Number(_amount)
        const _newBorrowPercent =
            (_newDebtValue * 100) / (_newCollateralValue * selectedMarket.collateralMaxDebtRatio)
        const _liquidationPrice =
            (_newDebtValue * selectedMarket.priceUsd) /
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold)
        const _health =
            (_newCollateralValue * selectedMarket.collateralLiquidationThreshold) / _newDebtValue

        setLiquidationPriceDeposit(_liquidationPrice)
        setHealthDeposit(_health)
        setNewBorrowPercentDeposit(_newBorrowPercent)
        setBorrowInput(String(_amount))
    }

    return (
        <>
            <div className="space-y-4">
                <button
                    className={classNames(
                        'w-full text-left space-y-1 bg-neutral-800 bg-opacity-50 border-2 border-neutral-800 p-4 rounded'
                    )}
                    onClick={() => setShowTool((_) => !_)}
                >
                    <div className="flex items-center space-x-4">
                        <p className="text-2xl font-medium">
                            {isDeposit
                                ? `Deposit ${selectedMarket.symbol}, borrow cUSD`
                                : `Repay cUSD, Withdraw ${selectedMarket.symbol}`}
                        </p>
                    </div>
                    <p className="opacity-50">
                        {isDeposit
                            ? `Deposit your ${selectedMarket.symbol} to create a
                                        collateralized position and mint cUSD against it, instantly.`
                            : `Repay your cUSD loans and withdraw your ${selectedMarket.symbol} back into
                        your wallet.`}
                    </p>
                </button>

                <AnimatePresence>
                    {showTool && (
                        <SlideOpen className="space-y-2">
                            <div className="flex flex-col gap-2 md:flex-row">
                                <div className="flex-1 space-y-1">
                                    <p className="text-xs font-medium">
                                        {isDeposit
                                            ? `Amount of ${selectedMarket.symbol} to deposit.`
                                            : `Amount of cUSD to repay.`}
                                    </p>
                                    <Input
                                        type="number"
                                        value={isDeposit ? depositInput : repayInput}
                                        onChange={
                                            isDeposit ? onChangeAmountDeposit : onChangeAmountRepay
                                        }
                                        onMax={isDeposit ? handleMaxDeposit : handleMaxRepay}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-xs font-medium">
                                        {isDeposit
                                            ? `Amount of cUSD to borrow.`
                                            : `Amount of ${selectedMarket.symbol} to withdraw.`}
                                    </p>
                                    <Input
                                        type="number"
                                        value={isDeposit ? borrowInput : withdrawInput}
                                        onChange={
                                            isDeposit
                                                ? onChangeAmountBorrow
                                                : onChangeAmountWithdraw
                                        }
                                        onMax={isDeposit ? handleMaxBorrow : handleMaxWithdraw}
                                    />
                                </div>
                            </div>

                            {isDeposit && (!!depositInput || !!borrowInput) && (
                                <div className="p-4 bg-white rounded bg-opacity-10">
                                    <DataPoint
                                        title="Borrowed Percent"
                                        value={`${
                                            borrowPercent ? borrowPercent.toFixed(2) : '0'
                                        }% => ${
                                            newBorrowPercentDeposit &&
                                            newBorrowPercentDeposit < 9000000
                                                ? `${newBorrowPercentDeposit.toFixed(2)}%`
                                                : 'None'
                                        }`}
                                    />
                                    <DataPoint
                                        title="Liquidation Price"
                                        value={
                                            liquidationPriceDeposit < 900000 &&
                                            liquidationPriceDeposit
                                                ? liquidationPriceDeposit.toFixed(2)
                                                : 'None'
                                        }
                                    />
                                    <DataPoint
                                        title="Health Factor"
                                        value={
                                            healthDeposit < 900000 && healthDeposit
                                                ? healthDeposit.toFixed(2)
                                                : 'None'
                                        }
                                    />
                                </div>
                            )}

                            {!isDeposit && (!!withdrawInput || !!repayInput) && (
                                <div className="p-4 bg-white rounded bg-opacity-10">
                                    <DataPoint
                                        title="Borrowed Percent"
                                        value={`${
                                            borrowPercent ? borrowPercent.toFixed(2) : '0'
                                        }% => ${
                                            newBorrowPercentRepay && newBorrowPercentRepay > 0
                                                ? `${newBorrowPercentRepay.toFixed(2)}%`
                                                : 'None'
                                        }`}
                                    />
                                    <DataPoint
                                        title="Liquidation Price"
                                        value={
                                            liquidationPriceRepay > 0 && liquidationPriceRepay
                                                ? liquidationPriceRepay.toFixed(2)
                                                : 'None'
                                        }
                                    />
                                    <DataPoint
                                        title="Health Factor"
                                        value={
                                            healthRepay > 0 && liquidationPriceRepay
                                                ? healthRepay.toFixed(2)
                                                : 'None'
                                        }
                                    />
                                </div>
                            )}

                            <ConnectWalletFirstButton>
                                <Button
                                    loading={
                                        isDeposit
                                            ? depositStatus === 'loading'
                                            : withdrawStatus === 'loading'
                                    }
                                    onClick={isDeposit ? () => onDeposit() : () => onRepay()}
                                    disabled={
                                        isDeposit
                                            ? !depositInput && !borrowInput
                                            : !withdrawInput && !repayInput
                                    }
                                    className="text-white bg-red-600 rounded hover:bg-red-700"
                                >
                                    {isDeposit ? 'Deposit & Borrow' : 'Withdraw & Repay'}
                                </Button>
                            </ConnectWalletFirstButton>
                        </SlideOpen>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
