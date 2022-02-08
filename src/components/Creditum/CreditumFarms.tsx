import useFarmData from '../../hooks/Creditum/useFarmData'
import InfoBanner from '../InfoBanner'
import { useEffect, useState } from 'react'
import DataPoint from '../DataPoint'
import LoadingBanner from '../LoadingBanner'
import Modal from '../Modal'
import classNames from 'classnames'

const Farm = ({ farm, open }) => {
    return (
        // <div className="bg-neutral-700 p-6 space-y-6 transform transition ease-in-out hover:-translate-y-1 text-left">
        <div className="bg-neutral-700 p-6 space-y-6 text-left">
            <div className="flex">
                <div className="flex-1 space-y-1">
                    <p className="font-medium text-2xl">{farm.name}</p>
                    <a className="underline hover:no-underline opacity-50" href={farm.buyLink} target="_blank">
                        <i className="fas fa-link mr-2" />
                        <span>
                            Get <span className="font-medium">{farm.name}</span> Tokens
                        </span>
                    </a>
                </div>

                <img className="h-24 w-24" src={farm.icon} alt="" />
            </div>

            <div>
                <DataPoint title="APR" value="13%" />
                <DataPoint title="Liquidity" value="$123,123" />
                <DataPoint title="Your Deposits" value="$123,123" />
                <DataPoint title="Your Earnings" value="$123,123" />
            </div>

            <div className="flex gap-2">
                <button onClick={() => open('deposit')} className="bg-neutral-800 hover:bg-neutral-900 px-4 py-2 font-medium flex-1 rounded">
                    Deposit
                </button>
                <button onClick={() => open('withdraw')} className="bg-neutral-800 hover:bg-neutral-900 px-4 py-2 font-medium flex-1 rounded">
                    Withdraw
                </button>
            </div>
        </div>
    )
}

export default function CreditumFarms() {
    const { farmData: farms } = useFarmData()

    const [selectedFarm, setSelectedFarm] = useState()
    const [mode, setMode] = useState<'deposit' | 'withdraw' | null>(null)

    const isDeposit = mode === 'deposit'
    const isWithdraw = mode === 'withdraw'

    const showModal = mode && selectedFarm

    const openModal = (farm, mode) => {
        setSelectedFarm(farm)
        setMode(mode)
    }
    const closeModal = () => setMode(null)

    return (
        <>
            <Modal style="creditum" visible={showModal} onClose={closeModal}>
                <div className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-2xl font-medium">{isDeposit ? 'Deposit' : 'Withdraw'}</p>
                        <p>Eu sit ipsum exercitation aliquip. Sint et qui ex adipisicing cupidatat tempor.</p>
                    </div>

                    <div>
                        <DataPoint title="LP Token Balance" value="$123,123" />
                        <DataPoint title="LP Token Deposit Balance" value="$123,123" />
                        <DataPoint title="cUSD Amount" value="$123,123" />
                        <DataPoint title="agEUR Amount" value="$123,123" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row">
                            <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">Amount of CREDIT to {isDeposit ? 'deposit' : 'withdraw'}.</p>
                                <input type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                            </div>
                            {/* <div className="flex-1 space-y-1">
                                <p className="text-xs font-medium">Amount of cUSD to borrow.</p>
                                <input type="number" className="w-full px-4 py-2 bg-white rounded outline-none bg-opacity-10" />
                            </div> */}
                        </div>

                        <button className={classNames('w-full p-2 text-white bg-green-800 hover:bg-green-900 rounded')}>{isDeposit ? 'Deposit' : 'Withdraw'}</button>
                    </div>
                </div>
            </Modal>

            <div className="w-full p-6 py-24 mx-auto max-w-7xl space-y-12">
                <InfoBanner
                    title="Deposit your tokens to start farming."
                    subtitle="Nulla eiusmod tempor id esse. Ut et magna consequat magna anim non ut irure enim magna ullamco est fugiat commodo. Veniam velit anim sint esse veniam id. Proident pariatur qui adipisicing elit irure consectetur fugi."
                />

                {!farms && <LoadingBanner title="Farms are loading..." />}

                {farms && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {farms.map((farm) => (
                            <Farm farm={farm} key={farm.id} open={(mode) => openModal(farm, mode)} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
