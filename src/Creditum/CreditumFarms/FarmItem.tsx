import { useState } from 'react'
import { CONTRACT_CREDITUM_FARMS } from '../../data'
import useFarm from '../hooks/useFarm'
import useAlerts from '../../hooks/useAlerts'
import { commaFormatter } from '../../utils'
import Button from '../../components/Btns/Button'
import ConnectWalletFirstButton from '../../components/Btns/ConnectWalletFirstButton'
import DataPoint from '../../components/DataPoint/DataPoint'

export default function FarmItem({ farm, open }) {
    const { claim } = useFarm()
    const { newAlert } = useAlerts()
    const [status, setStatus] = useState('idle')

    const onClaim = async () => {
        try {
            newAlert({
                title: 'Claiming...',
                subtitle: 'Claiming your rewards. Please complete the transaction on your wallet.',
                mood: 'negative'
            })
            setStatus('loading')
            await claim(farm.pid)
            setStatus('idle')
        } catch (error) {
            newAlert({
                title: 'Claim Failed',
                subtitle: 'Failed to claim your rewards. Please try again.',
                mood: 'negative'
            })
        }
    }

    const hasEarnings = farm.earnings.some((earning) => earning !== '0')

    return (
        <div className="p-6 space-y-6 shadow-2xl bg-neutral-800 bg-opacity-50 border-2 border-neutral-800 rounded-2xl">
            <div className="flex">
                <div className="flex-1 space-y-1">
                    <p className="text-2xl font-medium">{farm.name}</p>
                    <a
                        className="underline opacity-50 hover:no-underline"
                        href={farm.buyLink}
                        target="_blank"
                    >
                        <i className="mr-2 fas fa-link" />
                        <span>
                            Get <span className="font-medium">{farm.name}</span> Tokens
                        </span>
                    </a>
                </div>

                <img className="w-24 h-24" src={farm.icon} alt="" />
            </div>

            <div>
                {farm.apy
                    .filter((apy) => apy !== 0)
                    .map((apy, index) => (
                        <DataPoint
                            title="APR"
                            key={apy}
                            value={`${commaFormatter(apy)}% ${
                                CONTRACT_CREDITUM_FARMS[250].earnTokens[index].name
                            }`}
                            lineClass="bg-white bg-opacity-20"
                        />
                    ))}
                <DataPoint
                    title="Liquidity"
                    value={`$${commaFormatter(farm.tvl, 0)}`}
                    lineClass="bg-white bg-opacity-20"
                />
                {farm.deposited !== '0' && (
                    <DataPoint
                        title="Your Deposits"
                        value={`$${commaFormatter(farm.userLpValue)}`}
                        lineClass="bg-white bg-opacity-20"
                    />
                )}

                {farm.earnings
                    .filter((earnings) => earnings !== '0')
                    .map((earnings, index) => (
                        <DataPoint
                            title={`Your Earnings in ${CONTRACT_CREDITUM_FARMS[250].earnTokens[index].name}`}
                            key={earnings}
                            value={`${commaFormatter(earnings)}`}
                            lineClass="bg-white bg-opacity-20"
                        />
                    ))}
            </div>

            <div className="space-y-2">
                <div className="flex gap-2">
                    <Button
                        className="bg-yellow-400 text-neutral-800 hover:bg-yellow-500"
                        onClick={() => open('deposit')}
                    >
                        Deposit
                    </Button>
                    <Button
                        className="bg-yellow-400 text-neutral-800 hover:bg-yellow-500"
                        onClick={() => open('withdraw')}
                    >
                        Withdraw
                    </Button>
                </div>

                {hasEarnings && (
                    <ConnectWalletFirstButton>
                        <Button
                            onClick={() => onClaim()}
                            loading={status === 'loading'}
                            className="bg-yellow-500 hover:bg-yellow-600 text-neutral-800"
                        >
                            Claim Rewards
                        </Button>
                    </ConnectWalletFirstButton>
                )}
            </div>
        </div>
    )
}
