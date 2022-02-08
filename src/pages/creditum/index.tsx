import { useEffect } from 'react'
import { CreditumAppWrapper } from '../../components/Creditum/CreditumAppWrapper'
import useCreditumData, { useCreditumDataInternal } from '../../hooks/Creditum/useCreditumData'

export default function Creditum() {
    const data = useCreditumDataInternal()

    useEffect(() => console.log(data), [])

    return (
        <CreditumAppWrapper>
            <div className="w-full max-w-7xl mx-auto p-6 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                    <div className="border-4 border-dotted border-neutral-700  p-6 py-24 flex items-center justify-center">
                        <p className="font-mono">Select a Market</p>
                    </div>
                    <div>{JSON.stringify(data)}</div>
                </div>
            </div>
        </CreditumAppWrapper>
    )
}
