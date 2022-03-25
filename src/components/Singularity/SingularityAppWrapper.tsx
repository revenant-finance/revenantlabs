import { createContext, useContext } from 'react'
import { SingularityContext, useSingularityInteral } from '../../hooks/useSingularity'
import MeshBackground from '../MeshBackground'
import SingularityHeader from './SingularityHeader'

export function SingularityAppWrapper({ children }) {
    const hook = useSingularityInteral()

    return (
        <SingularityContext.Provider
            value={{
                ...hook
            }}
        >
            <SingularityHeader />

            <div className="w-full h-full bg-center bg-cover p-6 py-24">
                <MeshBackground id="singularity-gradient-colors" />
                <div className="bg-black fixed inset-0 bg-opacity-50" />
                <div className="relative z-10">{children}</div>
            </div>
        </SingularityContext.Provider>
    )
}
