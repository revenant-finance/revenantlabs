import useFarmData from '../hooks/useFarmData'
import InfoBanner from '../../components/Banners/InfoBanner'
import LoadingBanner from '../../components/Loaders/LoadingBanner'
import FarmItem from './FarmItem'
import FarmModal from './FarmModal'

export default function CreditumFarms() {
    const { farmData, setSelectedFarm, setMode } = useFarmData()

    const farms = farmData?.farms
    const openModal = (farm, mode) => {
        setSelectedFarm(farm)
        setMode(mode)
    }

    return (
        <>
            <FarmModal />

            <div className="w-full p-6 mx-auto space-y-12 max-w-7xl">
                <InfoBanner
                    header="Farming"
                    title="Deposit your tokens to start farming."
                    subtitle="Our farms use a modified version of the MasterChef contract that allows for multiple tokens to be rewarded per farming token. Currently, possible reward tokens are being given out in CREDIT and ANGLE"
                />

                {!farms?.length && <LoadingBanner title="Farms are loading..." />}

                {farms?.length && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {farms.map((farm, index) => (
                            <FarmItem
                                farm={farm}
                                key={farm.pid}
                                open={(mode) => openModal(farm, mode)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
