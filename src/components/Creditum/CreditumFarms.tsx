import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { CONTRACT_CREDITUM_FARMS } from '../../data/'
import useFarm from '../../hooks/Creditum/useFarm'
import useFarmData from '../../hooks/Creditum/useFarmData'
import useAlerts from '../../hooks/useAlerts'
import { formatter } from '../../utils'
import Button from '../Button'
import ConnectWalletFirstButton from '../ConnectWalletFirstButton'
import DataPoint from '../DataPoint'
import InfoBanner from '../InfoBanner'
import Input from '../Input'
import LoadingBanner from '../LoadingBanner'
import Modal from '../Modal'

const Farm = ({ farm, open }) => {
    const { claim } = useFarm()
    const { newAlert } = useAlerts()
    const [status, setStatus] = useState('idle')

    const onClaim = async () => {
        try {
            newAlert({ title: 'Claiming...', subtitle: 'Claiming your rewards. Please complete the transaction on your wallet.', mood: 'negative' })
            setStatus('loading')
            await claim(farm.pid)
            setStatus('idle')
        } catch (error) {
            newAlert({ title: 'Claim Failed', subtitle: 'Failed to claim your rewards. Please try again.', mood: 'negative' })
        }
    }

    const hasEarnings = farm.earnings.some((earning) => earning !== '0')

    return (
        <div className="p-6 space-y-6 text-left bg-neutral-700">
            <div className="flex">
                <div className="flex-1 space-y-1">
                    <p className="text-2xl font-medium">{farm.name}</p>
                    <a className="underline opacity-50 hover:no-underline" href={farm.buyLink} target="_blank">
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
                        <DataPoint title="APR" value={`${formatter(apy)}% ${CONTRACT_CREDITUM_FARMS[250].earnTokens[index].name}`} />
                    ))}
                <DataPoint title="Liquidity" value={`$${formatter(farm.tvl)}`} />
                {farm.deposited !== '0' && <DataPoint title="Your Deposits" value={`$${formatter(farm.deposited)}`} />}

                {farm.earnings
                    .filter((earnings) => earnings !== '0')
                    .map((earnings, index) => (
                        <DataPoint title={`Your Earnings in ${CONTRACT_CREDITUM_FARMS[250].earnTokens[index].name}`} value={`$${formatter(earnings)}`} />
                    ))}
            </div>

            <div className="space-y-2">
                <div className="flex gap-2">
                    <button onClick={() => open('deposit')} className="flex-1 px-4 py-2 font-medium rounded bg-neutral-800 hover:bg-neutral-900">
                        Deposit
                    </button>
                    <button onClick={() => open('withdraw')} className="flex-1 px-4 py-2 font-medium rounded bg-neutral-800 hover:bg-neutral-900">
                        Withdraw
                    </button>
                </div>

                {hasEarnings && (
                    <ConnectWalletFirstButton>
                        <Button onClick={() => onClaim()} loading={status === 'loading'} className="bg-yellow-400 text-neutral-700">
                            Claim Rewards
                        </Button>
                    </ConnectWalletFirstButton>
                )}
            </div>
        </div>
    )
}

export default function CreditumFarms() {
    const { farmData } = useFarmData()
    const { deposit, withdraw, claim } = useFarm()
    const { newAlert, clearAlert } = useAlerts()

    const farms = farmData?.farms

    const [status, setStatus] = useState('loading')
    const [value, setValue] = useState('')
    const [selectedFarm, setSelectedFarm] = useState()
    const [mode, setMode] = useState<'deposit' | 'withdraw' | null>(null)

    const isDeposit = mode === 'deposit'
    const showModal = mode && selectedFarm

    const openModal = (farm, mode) => {
        setSelectedFarm(farm)
        setMode(mode)
    }
    const closeModal = () => setMode(null)

    useEffect(() => {
        setValue('')
    }, [mode])

    const onDeposit = () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Depositing...', subtitle: 'Please wait...' })
            deposit(selectedFarm.pid, value)
            newAlert({ title: 'Deposit Complete', subtitle: 'Your deposit has been completed.' })
            setStatus('idle')
        } catch (error) {
            setStatus('error')
            newAlert({ title: 'Deposit Failed', subtitle: 'Failed to deposit. Please try again.', mood: 'negative' })
        }
    }

    const onWithdraw = () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Withdraw...', subtitle: 'Please wait...' })
            withdraw(selectedFarm.pid, value)
            newAlert({ title: 'Withdraw Complete', subtitle: 'Your withdraw has been completed.' })
            setStatus('idle')
        } catch (error) {
            setStatus('error')
            newAlert({ title: 'Withdraw Failed', subtitle: 'Failed to withdraw. Please try again.', mood: 'negative' })
        }
    }

    return (
        <>
            <Modal style="creditum" visible={showModal} onClose={closeModal}>
                <div className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-2xl font-medium">{isDeposit ? 'Deposit' : 'Withdraw'}</p>
                        <p>Eu sit ipsum exercitation aliquip. Sint et qui ex adipisicing cupidatat tempor.</p>
                    </div>

                    <div>
                        <DataPoint title="LP Token Balance" value={`${formatter(selectedFarm?.depositTokenBalance)}`} />
                        <DataPoint title="LP Token Staked" value={`${formatter(selectedFarm?.deposited)}`} />

                        {selectedFarm?.userTokens.map((token) => (
                            <DataPoint title={`${token.token} Amount`} value={`${formatter(token.amount)} ${token.token}`} />
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">Amount of CREDIT to {isDeposit ? 'deposit' : 'withdraw'}.</p>
                                <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} onMax={() => setValue(150)} />
                            </div>
                        </div>

                        <ConnectWalletFirstButton>
                            <Button disabled={!value} loading={status === 'loading'} onClick={isDeposit ? () => onDeposit() : () => onWithdraw()} className={classNames('text-neutral-700', isDeposit ? 'bg-green-500' : 'bg-red-500')}>
                                {isDeposit ? 'Deposit' : 'Withdraw'}
                            </Button>
                        </ConnectWalletFirstButton>
                    </div>
                </div>
            </Modal>

            <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
                <InfoBanner header="Farming" title="Deposit your tokens to start farming." subtitle="Nulla eiusmod tempor id esse. Ut et magna consequat magna anim non ut irure enim magna ullamco est fugiat commodo. Veniam velit anim sint esse veniam id. Proident pariatur qui adipisicing elit irure consectetur fugi." />

                {!farms && <LoadingBanner title="Farms are loading..." />}

                {farms && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {farms.map((farm) => (
                            <Farm farm={farm} key={farm.id} open={(mode) => openModal(farm, mode)} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
