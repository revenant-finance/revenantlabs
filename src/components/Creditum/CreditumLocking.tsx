import classNames from 'classnames'
import { useEffect, useState } from 'react'
import useVeCredit from '../../hooks/Creditum/useVeCredit'
import useVeCreditData from '../../hooks/Creditum/useVeCreditData'
import useAlerts from '../../hooks/useAlerts'
import { commaFormatter, epochToDate, currentEpoch } from '../../utils'
import Button from '../Button'
import ConnectWalletFirstButton from '../ConnectWalletFirstButton'
import DataPoint from '../DataPoint'
import InfoBanner from '../InfoBanner'
import Input from '../Input'

const secondsWeek = 60 * 60 * 24 * 7
const fourYearsSeconds = 60 * 60 * 24 * 365 * 4

const calculateUnlockEpoch = (time, date) => {
    const lockDate = date + time
    const roundedLockDateEpoch = Math.floor(lockDate / secondsWeek) * secondsWeek
    return roundedLockDateEpoch
}

const TimeStakeButton = ({ children, value, stakingTime, setStakingTime, lockEnd = 0 }) => {
    let disabled = false
    if (lockEnd) {
        disabled = value + lockEnd > currentEpoch + fourYearsSeconds
    }

    return (
        <Button className={classNames(stakingTime === value ? 'bg-yellow-400 text-neutral-700' : 'bg-neutral-600')} onClick={() => setStakingTime(value)} disabled={disabled}>
            {children}
        </Button>
    )
}

export default function CreditumLocking() {
    const [status, setStatus] = useState('idle')
    const [claimStatus, setClaimStatus] = useState('idle')
    const [lockingMode, setLockingMode] = useState<'locking' | 'unlocking'>('locking')
    const [updateMode, setUpdateMode] = useState<'amount' | 'time' | null>(null)
    const [stakingTime, setStakingTime] = useState(0)
    const [value, setValue] = useState('')
    const { newAlert } = useAlerts()
    const { veCreditData } = useVeCreditData()

    useEffect(() => {
        if (veCreditData?.lockEnd === 0) return
        if (veCreditData?.lockEnd < currentEpoch) {
            setLockingMode('unlocking')
        }
    }, [veCreditData])

    const hasExistingLock = veCreditData?.creditLocked !== '0'

    const { approve, initialDeposit, increaseAmount, increaseLockTime, withdraw, unstakeXCredit, claim } = useVeCredit()

    const onLock = async () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Locking...', subtitle: 'Please complete the rest of the transaction on your wallet.' })
            if (hasExistingLock) {
                if (updateMode === 'amount') await increaseAmount(value)
                if (updateMode === 'time') {
                    if (calculateUnlockEpoch(fourYearsSeconds, currentEpoch) <= veCreditData.lockEnd) {
                        newAlert({ title: 'Locking Failed', subtitle: 'Can only increase locking duration' })
                        return
                    }
                    await increaseLockTime(calculateUnlockEpoch(stakingTime, veCreditData?.lockEnd))
                }
            } else {
                await initialDeposit(value, calculateUnlockEpoch(stakingTime, currentEpoch))
            }
            newAlert({ title: 'Locking Complete', subtitle: 'Process complete. Your tokens have been locked.' })
            setStatus('idle')
        } catch (error) {
            newAlert({ title: 'Locking Failed', subtitle: 'An error occurred. Please try again', mood: 'negative' })
            setStatus('error')
        }
    }

    const onUnlock = async () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Unlocking...', subtitle: 'Please complete the rest of the transaction on your wallet.' })
            await withdraw()
            setStatus('idle')
            newAlert({ title: 'Unlocking Complete', subtitle: 'Process complete. Your tokens have been unlocked.' })
        } catch (error) {
            newAlert({ title: 'Locking Failed', subtitle: 'An error occurred. Please try again', mood: 'negative' })
            setStatus('error')
        }
    }

    const onClaim = async () => {
        try {
            setClaimStatus('loading')
            newAlert({ title: 'Claiming rewards...', subtitle: 'Please complete the rest of the transaction on your wallet.' })
            await claim()
            setClaimStatus('idle')
            newAlert({ title: 'Claim Complete', subtitle: 'Process complete. Your rewards have been sent to your wallet.' })
        } catch (error) {
            newAlert({ title: 'Claiming Failed', subtitle: 'An error occurred. Please try again', mood: 'negative' })
            setClaimStatus('error')
        }
    }

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            <InfoBanner header="Locking" title="Lock your CREDIT tokens" subtitle="Locking your CREDIT will give you veCREDIT tokens that accumulate fees generated from the protocol. veCREDIT is not transferable and locked for the period chose by the user. Users can increase the amount and time CREDIT is locked for after locking initially. 75% of fees go to veCREDIT 25% goes to treasury." />

            {veCreditData?.xTokenBalance && (
                <div className="p-6 space-y-2 bg-opacity-50 border-2 shadow-2xl bg-neutral-800 border-neutral-800 rounded-2xl">
                    <div className="flex flex-col items-end gap-6 md:flex-row">
                        <div>
                            <p className="text-2xl text-yellow-400">Migrate your xTokens to veTokens.</p>
                            <p className="text-xl">The new update is here. Migrate your xCREDIT into veCREDIT by unstaking your CREDIT from the xCREDIT pool so you're able to lock it and receive veCREDIT on our newest protocol update.</p>
                        </div>
                        <div>
                            <ConnectWalletFirstButton>
                                <Button onClick={() => unstakeXCredit(veCreditData?.xTokenBalance)} className="bg-yellow-400 text-neutral-700 whitespace-nowrap" loading={false}>
                                    Withdraw {veCreditData?.xTokenBalance} xCREDIT
                                </Button>
                            </ConnectWalletFirstButton>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 space-y-6 bg-opacity-50 border-2 shadow-2xl md:py-24 bg-neutral-800 border-neutral-800 rounded-2xl">
                <div className="w-full mx-auto space-y-6 sm:max-w-md">
                    <div className="space-y-1">
                        <div className="text-2xl font-medium">
                            {lockingMode === 'locking' && (
                                <div className="space-x-2">
                                    <i className="text-base fas fa-lock" />
                                    <span>Lock</span>
                                </div>
                            )}
                            {lockingMode === 'unlocking' && (
                                <div className="space-x-2">
                                    <i className="text-base fas fa-unlock"></i>
                                    <span>Unlock</span>
                                </div>
                            )}
                        </div>

                        <p>
                            {lockingMode === 'locking' && 'Lock your CREDIT tokens to receive veCREDIT.'}
                            {lockingMode === 'unlocking' && 'Your Lock duration has been completed. Please withdraw all CREDIT'}
                        </p>
                    </div>
                    <div>
                        <DataPoint title="Credit Balance" value={`${commaFormatter(veCreditData.tokenBal)}`} />
                        <DataPoint title="Total Locked" value={`${commaFormatter(veCreditData.veCreditTotalSupply)} CREDIT`} />
                        <DataPoint title="User Locked" value={`${commaFormatter(veCreditData.creditLocked)} CREDIT`} />
                        <DataPoint title="User veCREDIT" value={`${commaFormatter(veCreditData.veCreditBal)} veCREDIT`} />
                        <DataPoint title="Unlock Date" value={`${veCreditData.lockEnd - currentEpoch > 0 ? epochToDate(veCreditData.lockEnd) : 'None'}`} />
                    </div>

                    <div className="">
                        <DataPoint title="Next Reward Distribution" value={`${epochToDate(veCreditData.rewardTime)}`} />
                        <DataPoint title="Estimated Reward Distribution" value={`${commaFormatter(veCreditData.userRewardAmount)}`} />
                    </div>

                    <div className="space-y-2">
                        {lockingMode === 'locking' && (
                            <>
                                {!hasExistingLock && (
                                    <>
                                        <Input label={`Amount of CREDIT to Lock`} type="number" value={value} onChange={(e) => setValue(e.target.value)} onMax={() => setValue(veCreditData.tokenBal)} />
                                        <div className="space-y-2">
                                            <Input label="Lock Until:" disabled={true} value={epochToDate(calculateUnlockEpoch(stakingTime, currentEpoch))} />
                                            <div className="flex gap-2">
                                                <TimeStakeButton value={60 * 60 * 24 * 14} {...{ stakingTime, setStakingTime }}>
                                                    2wk
                                                </TimeStakeButton>
                                                <TimeStakeButton value={60 * 60 * 24 * 30} {...{ stakingTime, setStakingTime }}>
                                                    1mo
                                                </TimeStakeButton>
                                                <TimeStakeButton value={60 * 60 * 24 * 90} {...{ stakingTime, setStakingTime }}>
                                                    3mo
                                                </TimeStakeButton>
                                                <TimeStakeButton value={60 * 60 * 24 * 180} {...{ stakingTime, setStakingTime }}>
                                                    6mo
                                                </TimeStakeButton>
                                            </div>
                                            <div className="flex gap-2">
                                                <TimeStakeButton value={60 * 60 * 24 * 365} {...{ stakingTime, setStakingTime }}>
                                                    1yr
                                                </TimeStakeButton>
                                                <TimeStakeButton value={60 * 60 * 24 * 365 * 2} {...{ stakingTime, setStakingTime }}>
                                                    2yr
                                                </TimeStakeButton>
                                                <TimeStakeButton value={60 * 60 * 24 * 365 * 4} {...{ stakingTime, setStakingTime }}>
                                                    4yr
                                                </TimeStakeButton>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {hasExistingLock && (
                                    <div className="flex gap-2">
                                        <Button className="bg-neutral-800" onClick={() => setUpdateMode('amount')}>
                                            Increase Amount
                                        </Button>
                                        <Button className="bg-neutral-800" onClick={() => setUpdateMode('time')}>
                                            Increase Time
                                        </Button>
                                    </div>
                                )}

                                {hasExistingLock && updateMode && (
                                    <>
                                        {updateMode === 'amount' && <Input label={`Amount of CREDIT to Lock`} type="number" value={value} onChange={(e) => setValue(e.target.value)} onMax={() => setValue(veCreditData.tokenBal)} />}
                                        {updateMode === 'time' && (
                                            <div className="space-y-2">
                                                <Input label="Lock Until:" value={epochToDate(calculateUnlockEpoch(stakingTime, veCreditData?.lockEnd))} disabled={true} onMax={() => setStakingTime(currentEpoch + fourYearsSeconds - veCreditData?.lockEnd)} />
                                                <div className="flex gap-2">
                                                    <TimeStakeButton value={60 * 60 * 24 * 14} {...{ stakingTime, setStakingTime, lockEnd: veCreditData?.lockEnd }}>
                                                        2wk
                                                    </TimeStakeButton>
                                                    <TimeStakeButton value={60 * 60 * 24 * 30} {...{ stakingTime, setStakingTime, lockEnd: veCreditData?.lockEnd }}>
                                                        1mo
                                                    </TimeStakeButton>
                                                    <TimeStakeButton value={60 * 60 * 24 * 90} {...{ stakingTime, setStakingTime, lockEnd: veCreditData?.lockEnd }}>
                                                        3mo
                                                    </TimeStakeButton>
                                                    <TimeStakeButton value={60 * 60 * 24 * 180} {...{ stakingTime, setStakingTime, lockEnd: veCreditData?.lockEnd }}>
                                                        6mo
                                                    </TimeStakeButton>
                                                </div>
                                                <div className="flex gap-2">
                                                    <TimeStakeButton value={60 * 60 * 24 * 365} {...{ stakingTime, setStakingTime, lockEnd: veCreditData?.lockEnd }}>
                                                        1yr
                                                    </TimeStakeButton>
                                                    <TimeStakeButton value={60 * 60 * 24 * 365 * 2} {...{ stakingTime, setStakingTime, lockEnd: veCreditData?.lockEnd }}>
                                                        2yr
                                                    </TimeStakeButton>
                                                    <TimeStakeButton value={60 * 60 * 24 * 365 * 4} {...{ stakingTime, setStakingTime, lockEnd: veCreditData?.lockEnd }}>
                                                        4yr
                                                    </TimeStakeButton>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {veCreditData.userRewardAmount && veCreditData.userRewardAmount !== '0' && (
                            <Button loading={claimStatus === 'loading'} className="bg-green-500 text-neutral-900" onClick={() => onClaim()}>
                                Claim Rewards
                            </Button>
                        )}

                        <Button loading={status === 'loading'} disabled={!value && !stakingTime && lockingMode !== 'unlocking'} onClick={lockingMode === 'locking' ? () => onLock() : () => onUnlock()} className={classNames('text-neutral-900 bg-yellow-400')}>
                            {lockingMode === 'locking' ? 'Lock CREDIT' : 'Unlock CREDIT'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
