import useFarmData from '../../hooks/Creditum/useFarmData'
import InfoBanner from '../InfoBanner'
import { useEffect } from 'react'
import DataPoint from '../DataPoint'
import LoadingBanner from '../LoadingBanner'

const Farm = ({ farm }) => {
    return (
        <button className="bg-neutral-700 p-6 space-y-6 transform transition ease-in-out hover:-translate-y-1 text-left">
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
        </button>
    )
}

export default function CreditumFarms() {
    const { farmData: farms } = useFarmData()

    useEffect(() => console.log(farms), [farms])

    return (
        <div className="w-full p-6 py-24 mx-auto max-w-7xl space-y-12">
            <InfoBanner
                title="Deposit your tokens to start farming."
                subtitle="Nulla eiusmod tempor id esse. Ut et magna consequat magna anim non ut irure enim magna ullamco est fugiat commodo. Veniam velit anim sint esse veniam id. Proident pariatur qui adipisicing elit irure consectetur fugi."
            />

            {!farms && <LoadingBanner title="Farms are loading..." />}

            {farms && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {farms.map((farm) => (
                        <Farm farm={farm} key={farm.id} />
                    ))}
                </div>
            )}
        </div>
    )
}
