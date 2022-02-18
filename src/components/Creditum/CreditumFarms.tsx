import useFarmData from '../../hooks/Creditum/useFarmData'
import InfoBanner from '../InfoBanner'
import { useEffect, useState } from 'react'
import DataPoint from '../DataPoint'
import LoadingBanner from '../LoadingBanner'
import Modal from '../Modal'
import classNames from 'classnames'
import { formatter } from '../../utils'

const Farm = ({ farm, open }) => {
    return (
        // <div className="p-6 space-y-6 text-left transition ease-in-out transform bg-neutral-700 hover:-translate-y-1">
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

            {/* {JSON.stringify(farm, null, 4)} */}

            <div>
                {/* {farm.apy
                    .filter((apy) => apy !== 0)
                    .map((apy) => (
                        <DataPoint title="APR" value={`${formatter(apy)}%`} />
                    ))} */}
                <DataPoint title="APR" value={`${farm.apy.filter((apy) => apy !== 0).map((apy) => formatter(apy))}%`} />
                <DataPoint title="Liquidity" value="0" />
                <DataPoint title="Your Deposits" value="0" />
                <DataPoint title="Your Earnings" value="0" />
            </div>

            <div className="flex gap-2">
                <button onClick={() => open('deposit')} className="flex-1 px-4 py-2 font-medium rounded bg-neutral-800 hover:bg-neutral-900">
                    Deposit
                </button>
                <button onClick={() => open('withdraw')} className="flex-1 px-4 py-2 font-medium rounded bg-neutral-800 hover:bg-neutral-900">
                    Withdraw
                </button>
            </div>
        </div>
    )
}

export default function CreditumFarms() {
    const { farmData } = useFarmData()

    const farms = farmData?.farms

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
                        <DataPoint title="LP Token Balance" value="0" />
                        <DataPoint title="LP Token Deposit Balance" value="0" />
                        <DataPoint title="cUSD Amount" value="0" />
                        <DataPoint title="agEUR Amount" value="0" />
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
