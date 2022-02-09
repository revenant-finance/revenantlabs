import MeshBackground from '../../components/MeshBackground'
import { SingularityAppWrapper } from '../../components/Singularity/SingularityAppWrapper'
import Swapper from '../../components/Singularity/Swapper'

export default function SingularityIndexPage() {
    return (
        <>
            <SingularityAppWrapper>
                <div className="w-full h-full bg-center bg-cover p-6 py-24">
                    <MeshBackground id="singularity-gradient-colors" />
                    <div className="bg-black absolute inset-0 bg-opacity-50"></div>
                    <Swapper />
                </div>
            </SingularityAppWrapper>
        </>
    )
}
