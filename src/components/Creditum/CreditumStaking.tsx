import { useState } from 'react'
import InfoBanner from '../InfoBanner'
import classNames from 'classnames'
import DataPoint from '../DataPoint'
import useVeCreditData from '../../hooks/Creditum/useVeCreditData'
import Button from '../Button'
import ConnectWalletFirstButton from '../ConnectWalletFirstButton'
import useVeCredit from '../../hooks/Creditum/useVeCredit'
import useAlerts from '../../hooks/useAlerts'
import { formatter, commaFormatter } from '../../utils'
import Input from '../Input'
import Countdown from '../CountDown'

const secondsWeek = 60 * 60 * 24 * 7
const currentEpoch = parseInt(+new Date()) / 1000

const TimeStakeButton = ({ children, value, stakingTime, setStakingTime }) => {
    return (
        <Button className={classNames(stakingTime === value ? 'bg-yellow-400 text-neutral-700' : 'bg-neutral-600')} onClick={() => setStakingTime(value)}>
            {children}
        </Button>
    )
}

const calculateUnlockEpoch = (time, date) => {
    const lockDate = date + time
    const roundedLockDateEpoch = Math.floor(lockDate / secondsWeek) * secondsWeek
    return roundedLockDateEpoch
}

const epochToDate = (epoch) => {
    return new Date(epoch * 1000).toLocaleDateString('en-gb', { year: 'numeric', month: 'long', day: 'numeric' })
}


export default function CreditumStaking() {
    const [status, setStatus] = useState('idle')
    const [stakingMode, setStakingMode] = useState<'staking' | 'unstaking'>('staking')
    const [updateMode, setUpdateMode] = useState<'amount' | 'time' | null>(null)
    const [stakingTime, setStakingTime] = useState(0)
    const [value, setValue] = useState('')
    const { newAlert } = useAlerts()
    const { veCreditData } = useVeCreditData()

    const stakingTimeInSeconds = stakingTime * 24 * 60 * 60
    const hasExistingLock = veCreditData?.creditLocked !== '0'

    const { approve, initialDeposit, increaseAmount, increaseLockTime, withdraw, unstakeXCredit } = useVeCredit()

    const onLock = async () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Locking...', subtitle: 'Please complete the rest of the transaction on your wallet.' })
            if (hasExistingLock) {
                if (updateMode === 'amount') await increaseAmount(value)
                if (updateMode === 'time') {
                    if (stakingTimeInSeconds < veCreditData.lockEnd - parseInt(+new Date() / 1000)) {
                        newAlert({ title: 'Locking Failed', subtitle: 'You can only lock an amount of time greater than previous lock' })
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

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            <InfoBanner header="Locking" title="Lock your CREDIT tokens" subtitle="Locking your CREDIT will give you veCREDIT tokens that accumulate fees generated from the protocol. veCREDIT is not transferable and locked for the period chose by the user. Users can increase the amount and time CREDIT is locked for after locking initially. 75% of fees go to veCREDIT 25% goes to treasury." />

            {veCreditData?.xTokenBalance && (
                <div className="p-6 bg-neutral-700">
                    <div className="flex flex-col items-end gap-6 md:flex-row">
                        <div>
                            <p className="text-2xl text-yellow-400">Migrate your xTokens to veTokens.</p>
                            <p className="text-xl">The new update is here. Migrate your xCREDIT into veCREDIT by unstaking your CREDIT from the xCREDIT pool so you're able to lock it and recieve veCREDIT on our newest protocol update.</p>
                        </div>
                        <div>
                            <ConnectWalletFirstButton>
                                <Button onClick={() => unstakeXCredit(veCreditData?.xTokenBalance)} className="bg-yellow-400 text-neutral-700 whitespace-nowrap">
                                    Withdraw {veCreditData?.xTokenBalance} xCREDIT
                                </Button>
                            </ConnectWalletFirstButton>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 py-24 bg-neutral-700">
                <div className="w-full mx-auto space-y-6 sm:max-w-md">
                    <div className="space-y-1">
                        <div className="flex space-x-2 text-2xl font-medium">
                            <button onClick={() => setStakingMode('staking')} className={classNames('space-x-2', stakingMode === 'staking' ? 'opacity-100' : 'opacity-50')}>
                                <i className="text-base fas fa-lock" />
                                <span>Lock</span>
                            </button>
                            <div className="flex-1" />
                            <button onClick={() => setStakingMode('unstaking')} className={classNames('space-x-2', stakingMode === 'unstaking' ? 'opacity-100' : 'opacity-25')}>
                                <i className="text-base fas fa-unlock"></i>
                                <span>Unlock</span>
                            </button>
                        </div>

                        <p>
                            {stakingMode === 'staking' && 'Lock your CREDIT tokens to recieve veCREDIT.'}
                            {stakingMode === 'unstaking' && 'Unlock your veCREDIT for CREDIT.'}
                        </p>
                    </div>
                    <div>
                        <DataPoint title="Credit Balance" value={`${commaFormatter(veCreditData.tokenBal)}`} />
                        <DataPoint title="Total Locked" value={`${commaFormatter(veCreditData.veCreditTotalSupply)}`} />
                        <DataPoint title="User Amount Locked" value={`${commaFormatter(veCreditData.creditLocked)} CREDIT`} />
                        <DataPoint title="User veCREDIT Balance" value={`${commaFormatter(veCreditData.veCreditBal)} veCREDIT`} />
                    </div>
                    <div className="">
                        <DataPoint title="Unlock Date" value={`${veCreditData.lockEnd - currentEpoch > 0 ? epochToDate(veCreditData.lockEnd) : 0}`} />
                        {/* <Countdown epochTime={veCreditData?.lockEnd} /> */}
                        {/* <DataPoint title="Time Until Unlock" value={`${formatter(veCreditData.lockEnd - +new Date() / 1000 > 0 ? (veCreditData.lockEnd - +new Date() / 1000) / (60 * 60) : 0)} hours`} /> */}
                    </div>

                    <div className="space-y-2">
                        {stakingMode === 'staking' && (
                            <>
                                {!hasExistingLock && (
                                    <>
                                        <Input label={`Amount of CREDIT to Lock`} type="number" value={value} onChange={(e) => setValue(e.target.value)} onMax={() => setValue(veCreditData.tokenBal)} />
                                        <div className="space-y-2">
                                            <Input label="Lock Until:" disabled="true" value={epochToDate(calculateUnlockEpoch(stakingTime, currentEpoch))} />
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
                                                <Input label="Lock Until:" value={epochToDate(calculateUnlockEpoch(stakingTime, veCreditData?.lockEnd))} disabled="true" />
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
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        <Button loading={status === 'loading'} disabled={!value && !stakingTime} onClick={stakingMode === 'staking' ? () => onLock() : () => onUnlock()} className={classNames('text-neutral-900 bg-yellow-400')}>
                            {stakingMode === 'staking' ? 'Lock CREDIT' : 'Unlock CREDIT'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
