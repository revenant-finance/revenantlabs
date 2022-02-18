import { useEffect, useState } from 'react'
import Typed from 'react-typed'

export default function Loader() {
    const [hide, setHide] = useState(false)

    useEffect(() => setTimeout(() => setHide(true), 3000), [])

    if (hide) return null
    return (
        <div className="absolute inset-0 top-0 left-0 flex items-center justify-center w-full h-full bg-white z-100">
            <div className="space-y-8">
                <div>
                    <img className="block w-16 mx-auto animate-spin" src="/img/scream-multi.png" alt="" />
                </div>
                <div>
                    <Typed className="font-mono text-center text-rainbow" strings={['Scream is loading...']} typeSpeed={40} />
                </div>
            </div>
        </div>
    )
}
