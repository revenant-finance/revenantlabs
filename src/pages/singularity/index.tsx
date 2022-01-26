import { useEffect } from 'react'
import { SingularityAppWrapper } from '../../components/Singularity/SingularityAppWrapper'
import Swapper from '../../components/Singularity/Swapper'
import { Gradient } from '../../lib/gradient'

export default function SingularityIndexPage() {
    useEffect(() => {
        const gradient = new Gradient()
        gradient.initGradient('#gradient-canvas')
    }, [])

    return (
        <>
            <SingularityAppWrapper>
                <div className="w-full h-full bg-center bg-cover p-6 py-24">
                    <div className="absolute inset-0">
                        <canvas id="gradient-canvas" data-transition-in></canvas>
                    </div>
                    <div className="bg-black absolute inset-0 bg-opacity-50"></div>
                    <Swapper />
                </div>
            </SingularityAppWrapper>
        </>
    )
}
