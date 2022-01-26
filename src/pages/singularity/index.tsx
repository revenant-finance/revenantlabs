import { createContext } from 'react'
import NavBar from '../../components/Singularity/NavBar'
import { SingularityAppWrapper } from '../../components/Singularity/SingularityAppWrapper'
import Swapper from '../../components/Singularity/Swapper'

export default function SingularityIndexPage() {
    return (
        <>
            <SingularityAppWrapper>
                <NavBar />
                <div className="w-full p-6 py-12 md:py-24">
                    <Swapper />
                </div>
            </SingularityAppWrapper>
        </>
    )
}
