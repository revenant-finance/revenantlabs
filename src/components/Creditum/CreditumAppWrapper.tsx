import Head from 'next/head'
import CredtiumHeader from './CreditumHeader'

export function CreditumAppWrapper({ children }) {
    return (
        <>
            <Head>
                <title>Creditum — Revenant Labs</title>
            </Head>

            <div className="fixed inset-0 bg-gradient-to-tl from-blue-900 to-blue-400 opacity-40" />

            <div className="relative z-10 space-y-6">
                <CredtiumHeader />

                {children}

                <div className="w-full p-6 py-24 mx-auto space-y-12 max-w-7xl">
                    <div className="w-full max-w-sm mx-auto space-y-1">
                        <p className="text-2xl opacity-50">
                            Creditum enables its users to mint cUSD — a safe and powerful stablecoin
                            — by depositing a variety of assets that earn yield passively, and farm
                            rewards against them.
                        </p>
                    </div>
                    <div className="text-xs font-medium text-center uppercase">
                        Revenant Labs — Creditum &copy; {new Date().getFullYear()}{' '}
                    </div>
                </div>
                <div className="flex">
                    <div className="flex-1 h-2 bg-purp" />
                    <div className="flex-1 h-2 bg-salmon" />
                    <div className="flex-1 h-2 bg-bluey" />
                    <div className="flex-1 h-2 bg-greeny" />
                    <div className="flex-1 h-2 bg-purp" />
                    <div className="flex-1 h-2 bg-salmon" />
                    <div className="flex-1 h-2 bg-bluey" />
                    <div className="flex-1 h-2 bg-greeny" />
                </div>
            </div>
        </>
    )
}
