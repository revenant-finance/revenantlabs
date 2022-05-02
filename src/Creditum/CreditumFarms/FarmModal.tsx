import classNames from 'classnames'
import { useEffect, useState } from 'react'
import useFarm from '../hooks/useFarm'
import useFarmData from '../hooks/useFarmData'
import useAlerts from '../../hooks/useAlerts'
import { commaFormatter } from '../../utils'
import Button from '../../components/Btns/Button'
import ConnectWalletFirstButton from '../../components/Btns/ConnectWalletFirstButton'
import DataPoint from '../../components/DataPoint/DataPoint'
import Input from '../../components/Inputs/Input'
import Modal from '../../components/Modals/Modal'

export default function FarmModal() {
    const { newAlert, clearAlert } = useAlerts()
    const { selectedFarm, setSelectedFarm, mode, setMode } = useFarmData()
    console.log(selectedFarm)

    const { deposit, withdraw } = useFarm()

    const [status, setStatus] = useState('idle')
    const [value, setValue] = useState('')

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

    const onDeposit = async () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Depositing...', subtitle: 'Please wait...' })
            await deposit(selectedFarm.pid, value)
            newAlert({ title: 'Deposit Complete', subtitle: 'Your deposit has been completed.' })
            setStatus('idle')
        } catch (error) {
            setStatus('error')
            newAlert({
                title: 'Deposit Failed',
                subtitle: 'Failed to deposit. Please try again.',
                mood: 'negative'
            })
        }
    }

    const onWithdraw = async () => {
        try {
            setStatus('loading')
            newAlert({ title: 'Withdraw...', subtitle: 'Please wait...' })
            await withdraw(selectedFarm.pid, value)
            newAlert({ title: 'Withdraw Complete', subtitle: 'Your withdraw has been completed.' })
            setStatus('idle')
        } catch (error) {
            setStatus('error')
            newAlert({
                title: 'Withdraw Failed',
                subtitle: 'Failed to withdraw. Please try again.',
                mood: 'negative'
            })
        }
    }
    return (
        <>
            <Modal style="creditum" visible={showModal} onClose={closeModal}>
                <div className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-2xl font-medium">{isDeposit ? 'Deposit' : 'Withdraw'}</p>
                        <p>Deposit {selectedFarm?.name} to earn farming Rewards</p>
                    </div>

                    <div>
                        <DataPoint
                            title="LP Token Balance"
                            value={`${commaFormatter(selectedFarm?.depositTokenBalance)}`}
                            lineClass="bg-white bg-opacity-20"
                        />
                        <DataPoint
                            title="LP Token Staked"
                            value={`${commaFormatter(selectedFarm?.deposited)}`}
                            lineClass="bg-white bg-opacity-20"
                        />

                        {selectedFarm?.userTokens.map((token) => (
                            <DataPoint
                                title={`${token.token} Amount`}
                                key={token.token}
                                value={`${commaFormatter(token.amount)} ${token.token}`}
                                lineClass="bg-white bg-opacity-20"
                            />
                        ))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">
                                    Amount of {selectedFarm?.name} to {isDeposit ? 'deposit' : 'withdraw'}.
                                </p>
                                <Input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onMax={() =>
                                        setValue(
                                            isDeposit
                                                ? selectedFarm?.depositTokenBalance
                                                : selectedFarm?.deposited
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <ConnectWalletFirstButton>
                            <Button
                                disabled={!value}
                                loading={status === 'loading'}
                                onClick={isDeposit ? () => onDeposit() : () => onWithdraw()}
                                className={classNames(
                                    'text-neutral-700 bg-yellow-400 hover:bg-yellow-500'
                                )}
                            >
                                {isDeposit ? 'Deposit' : 'Withdraw'}
                            </Button>
                        </ConnectWalletFirstButton>
                    </div>
                </div>
            </Modal>
        </>
    )
}
