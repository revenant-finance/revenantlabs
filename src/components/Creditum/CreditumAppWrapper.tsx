import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from '../Modal'
import { useState } from 'react'
import useVeCreditData from '../../hooks/Creditum/useVeCreditData'
import useVeCredit from '../../hooks/Creditum/useVeCredit'
import Button from '../Button'
import classNames from 'classnames'
import CredtiumHeader from './CreditumHeader'

interface HeaderLink {
    href: string
    icon: string
    children: any
    className?: string
}

const HeaderLink = ({ href, icon, children, className }: HeaderLink) => {
    const router = useRouter()
    const isThisPage = router.asPath === href
    return (
        <div className="flex items-center">
            <Link href={href} passHref>
                <a
                    className={classNames(
                        'flex items-center space-x-2',
                        isThisPage && 'bg-yellow-400 text-neutral-900 px-4 py-2',
                        className
                    )}
                >
                    <i
                        className={classNames(
                            'text-xs',
                            isThisPage ? 'opacity-100' : 'opacity-25',
                            icon
                        )}
                    />
                    <span>{children}</span>
                </a>
            </Link>
        </div>
    )
}

export function CreditumAppWrapper({ children }) {
    const [showModel, setShowModel] = useState(true)
    const { veCreditData } = useVeCreditData()
    const { approve } = useVeCredit()

    return (
        <>
            <Head>
                <title>Creditum — Revenant Labs</title>
            </Head>
            {Number(veCreditData?.allowance) > 0 && (
                <Modal style="creditum" visible={showModel} onClose={() => setShowModel(false)}>
                    <div className="space-y-4">
                        <div className="">
                            There is a minor bug with all veToken contracts. This is a combined
                            effort with LiquidDriver and SpiritSwap. Further details will be
                            revealed later. To avoid exposure please unapprove any approvals to the
                            veCREDIT contract. All locked veCREDIT is safe!
                        </div>
                        <Button
                            className="bg-yellow-400 text-neutral-700 whitespace-nowrap"
                            onClick={() => approve('0')}
                        >
                            UnApprove VeCredit
                        </Button>
                    </div>
                </Modal>
            )}

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

// :)
