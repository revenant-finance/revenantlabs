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
    const [stakingTime, setStakingTime] = useState(60 * 60 * 24 * 30)
    const [value, setValue] = useState(0)

    const { newAlert } = useAlerts()
    const { veCreditData, xTokenBalance } = useVeCreditData()

    const { approve, initialDeposit, increaseAmount, increaseLockTime, withdraw, unstakeXCredit } = useVeCredit()

    const onLock = async () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Locking...', subtitle: 'Please complete the rest of the transaction on your wallet.' })
            if (veCreditData.creditLocked) increaseAmount(value)
            else await initialDeposit(value, stakingTime)
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
            if (veCreditData.creditLocked) increaseAmount(value)
            else await withdraw()
            setStatus('idle')
        } catch (error) {
            newAlert({ title: 'Locking Failed', subtitle: 'An error occurred. Please try again', mood: 'negative' })
            setStatus('error')
        }
    }

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            <InfoBanner header="Staking" title="Staking your Credit and earn passive yield." subtitle="Deposit your Credit tokens with no lock-up time and received xCredit, a yield-bearing derivative and goverenance token that powers Creditum. Veniam in cupidatat deserunt et dolore reprehenderit cillum enim minim." />

            {xTokenBalance && (
                <div className="p-6  bg-neutral-700">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div>
                            <p className="text-2xl text-yellow-400">Migrate your xTokens to veTokens.</p>
                            <p className="text-xl">The new update is here. Migrate your xCREDIT into veCREDIT by unstaking your CREDIT from the xCREDIT pool so you're able to lock it and recieve veCREDIT on our newest protocol update.</p>
                        </div>
                        <div>
                            <ConnectWalletFirstButton>
                                <Button onClick={() => unstakeXCredit()} className="bg-yellow-400 text-neutral-700 whitespace-nowrap">
                                    Withdraw {xTokenBalance} xCREDIT
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
                                <i className="fas fa-lock text-base" />
                                <span>Lock</span>
                            </button>
                            <div className="flex-1" />
                            <button onClick={() => setStakingMode('unstaking')} className={classNames('space-x-2', stakingMode === 'unstaking' ? 'opacity-100' : 'opacity-25')}>
                                <i className="fas fa-unlock text-base"></i>
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
                        <DataPoint title="Time Remaining" value={`${formatter(veCreditData.lockEnd)}`} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">Amount of CREDIT to {stakingMode === 'staking' ? 'stake' : 'unstake'}.</p>
                                {stakingMode === 'staking' && <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} onMax={() => setValue(100)} />}
                            </div>
                        </div>

                        {stakingMode === 'staking' && !veCreditData?.creditLocked?.amount && (
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
                        )}

                        <Button loading={status === 'loading'} disabled={!value} onClick={stakingMode === 'staking' ? () => onLock() : () => onUnlock()} className={classNames('text-neutral-900 bg-yellow-400')}>
                            {stakingMode === 'staking' ? 'Lock CREDIT' : 'Unlock CREDIT'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
