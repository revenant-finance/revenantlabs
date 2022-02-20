import { useState } from 'react'
import InfoBanner from '../InfoBanner'
import classNames from 'classnames'
import DataPoint from '../DataPoint'
import useVeCreditData from '../../hooks/Creditum/useVeCreditData'
import Button from '../Button'
import ConnectWalletFirstButton from '../ConnectWalletFirstButton'
import useVeCredit from '../../hooks/Creditum/useVeCredit'
import useAlerts from '../../hooks/useAlerts'
import { formatter } from '../../utils'
import Input from '../Input'

const TimeStakeButton = ({ children, value, stakingTime, setStakingTime }) => {
    return (
        <Button className={classNames(stakingTime === value ? 'bg-yellow-400 text-neutral-700' : 'bg-neutral-600')} onClick={() => setStakingTime(value)}>
            {children}
        </Button>
    )
}

export default function CreditumStaking() {
    const [status, setStatus] = useState('idle')
    const [stakingMode, setStakingMode] = useState<'staking' | 'unstaking'>('staking')
    const [stakingTime, setStakingTime] = useState(7)
    const [value, setValue] = useState('')

    const stakingTimeInSeconds = (stakingTime * 24 * 60 * 60) + 360

    const { newAlert } = useAlerts()
    const { veCreditData } = useVeCreditData()

    const { approve, initialDeposit, increaseAmount, increaseLockTime, withdraw, unstakeXCredit } = useVeCredit()


    //add feature to increase lock time
    const onLock = async () => {
        try {
            if (stakingTimeInSeconds <= 60 * 60 * 24 * 7 ) {
                newAlert({ title: 'Locking Failed', subtitle: 'You cannot lock less than 7 days.', mood: 'negative' })
                return
            }
            setStatus('loading')
            newAlert({ title: 'Locking...', subtitle: 'Please complete the rest of the transaction on your wallet.' })
            if (veCreditData?.creditLocked !== '0') {
                await increaseAmount(value)
                await increaseLockTime(stakingTimeInSeconds)
            } 
            else {
                await initialDeposit(value, stakingTimeInSeconds)
            }
            setStatus('idle')
        } catch (error) {
            newAlert({ title: 'Locking Failed', subtitle: 'An error occurred. Please try again', mood: 'negative' })
            setStatus('error')
        }
    }

    const onUnlock = async () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Locking...', subtitle: 'Please complete the rest of the transaction on your wallet.' })
            await withdraw()
            setStatus('idle')
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

                        {/* <p>
                            {stakingMode === 'staking' && 'Stake your CREDIT tokens recieve xCREDIT.'}
                            {stakingMode === 'unstaking' && 'Unstake your CREDIT return xCREDIT.'}
                        </p> */}
                    </div>

                    <div>
                        <DataPoint title="Credit Balance" value={`${formatter(veCreditData.tokenBal)}`} />
                        <DataPoint title="Total Locked" value={`${formatter(veCreditData.veCreditTotalSupply)}`} />
                        <DataPoint title="User Amount Locked" value={`${formatter(veCreditData.creditLocked)}`} />
                        <DataPoint title="Time Until Unlock" value={`${formatter((veCreditData.lockEnd - (+new Date()/ 1000 )) / (60 * 60))} hours`} />
                    </div>

                    <div className="space-y-2">
                        {stakingMode === 'staking' && (
                            <>
                                <Input label={`Amount of CREDIT to ${stakingMode === 'staking' ? 'Lock' : 'Unlock'}`} type="number" value={value} onChange={(e) => setValue(e.target.value)} onMax={() => setValue(veCreditData.tokenBal)} />
                                <Input label="Lock Time (In Days)" value={stakingTime} onChange={(e) => setStakingTime(e.target.value)} type="number" onMax={() => setStakingTime(365 * 2)} />
                            </>
                        )}

                        {/* {stakingMode === 'staking' && !veCreditData?.creditLocked?.amount && (
                            <div className="flex gap-2">
                                <TimeStakeButton value={60 * 60 * 24 * 7} {...{ stakingTime, setStakingTime }}>
                                    1wk
                                </TimeStakeButton>
                                <TimeStakeButton value={60 * 60 * 24 * 30} {...{ stakingTime, setStakingTime }}>
                                    1mo
                                </TimeStakeButton>
                                <TimeStakeButton value={60 * 60 * 24 * 180} {...{ stakingTime, setStakingTime }}>
                                    6mo
                                </TimeStakeButton>
                                <TimeStakeButton value={60 * 60 * 24 * 365} {...{ stakingTime, setStakingTime }}>
                                    1yr
                                </TimeStakeButton>
                            </div>
                        )} */}

                        <Button loading={status === 'loading'} disabled={!value} onClick={stakingMode === 'staking' ? () => onLock() : () => onUnlock()} className={classNames('text-neutral-900 bg-yellow-400')}>
                            {stakingMode === 'staking' ? 'Lock CREDIT' : 'Unlock CREDIT'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
