import { useState } from 'react'
import InfoBanner from '../InfoBanner'
import classNames from 'classnames'
import DataPoint from '../DataPoint'
import useVeCreditData from '../../hooks/Creditum/useVeCreditData'

export default function CreditumStaking() {
    const [stakingMode, setStakingMode] = useState<'staking' | 'unstaking'>('staking')
    const { veCreditData } = useVeCreditData()
    console.log(veCreditData)

    return (
        <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
            {/* <p className="text-2xl font-medium opacity-50">Creditum</p> */}
            <InfoBanner header="Staking" title="Staking your Credit and earn passive yield." subtitle="Deposit your Credit tokens with no lock-up time and received xCredit, a yield-bearing derivative and goverenance token that powers Creditum. Veniam in cupidatat deserunt et dolore reprehenderit cillum enim minim." />

            <div className="p-6 py-24 bg-neutral-700">
                <div className="w-full mx-auto space-y-6 sm:max-w-md">
                    <div className="space-y-1">
                        <div className="flex space-x-2 text-2xl font-medium">
                            <button onClick={() => setStakingMode('staking')} className={classNames(stakingMode === 'staking' ? 'opacity-100' : 'opacity-50')}>
                                Stake
                            </button>
                            <div className="flex-1" />
                            <button onClick={() => setStakingMode('unstaking')} className={classNames(stakingMode === 'unstaking' ? 'opacity-100' : 'opacity-25')}>
                                Unstake
                            </button>
                        </div>

                        {/* <p>
                            {stakingMode === 'staking' && 'Stake your CREDIT tokens recieve xCREDIT.'}
                            {stakingMode === 'unstaking' && 'Unstake your CREDIT return xCREDIT.'}
                        </p> */}
                    </div>

                    <div>
                        <DataPoint title="APR" value="88%" />
                        <DataPoint title="xCredit Price" value="1.05492649 CREDIT" />
                        <DataPoint title="Credit Balance" value="0 CREDIT" />
                        <DataPoint title="xCredit Balance" value="22 xCREDIT" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">Amount of CREDIT to {stakingMode === 'staking' ? 'stake' : 'unstake'}.</p>
                                <input type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                            </div>
                            {/* <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">Amount of cUSD to borrow.</p>
                                <input type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                            </div> */}
                        </div>

                        <button className={classNames('w-full p-2 text-neutral-900 bg-yellow-400 rounded hover:bg-yellow-500')}>{stakingMode === 'staking' ? 'Stake' : 'Unstake'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
