import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'

export default function Naviation() {
    const wallet = useWallet()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handle = () => setOpen(false)
        window.addEventListener('scroll', handle)
        return () => window.removeEventListener('scroll', handle)
    }, [])

    useEffect(() => {
        const handle = () => setOpen(false)
        Router.events.on('routeChangeComplete', handle)
        return () => Router.events.off('scroll', handle)
    }, [])

    return (
        <>
            <div className="fixed top-0 right-0 p-6 z-30 pointer-events-none max-w-lg w-full flex flex-col items-end gap-2">
                <div className="flex gap-2">
                    <button onClick={() => wallet.connect()} className={classNames('pointer-events-auto bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-4 py-2 shadow-2xlt text-xs font-medium')}>
                        {/* {<i className={classNames('fas fa-wallet', wallet.account && 'text-orange-500')} />} */}
                        {wallet.account ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-6)}` : <i className="fas fa-wallet" />}
                    </button>
                    <button onClick={() => setOpen((_) => !_)} className={classNames('pointer-events-auto bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-4 py-2 shadow-2xl')}>
                        <i className={classNames('fas fa-bars transition ease-in-out duration-75', open && 'rotate-90 text-orange-500')}></i>
                    </button>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: '120%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '120%' }}
                            className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl max-w-xs w-full p-6 pointer-events-auto space-y-4"
                        >
                            <div className="flex flex-col gap-1">
                                <Link href="/" passHref>
                                    <a className="text-3xl uppercase font-montserrat font-extrabold">Home</a>
                                </Link>
                                <Link href="/" passHref>
                                    <a className="text-3xl uppercase font-montserrat font-extrabold">Docs</a>
                                </Link>
                            </div>

                            <div className="space-y-2">
                                <a className="bg-orange-500 block text-center p-2 font-medium text-orange-900 rounded" href="">
                                    Open <b>Creditum</b>
                                </a>
                                <Link href="/singularity">
                                    <a className="bg-blue-500 block text-center p-2 font-medium text-blue-900 rounded" href="">
                                        Open <b>Singularity</b>
                                    </a>
                                </Link>
                            </div>

                            <div className="flex items-center">
                                <div className="flex-1">
                                    <a href="# " className="font-mono underline opacity-50 hover:opacity-100">
                                        Support
                                    </a>
                                </div>
                                <p className="text-center space-x-2">
                                    <a href="/twitter" target="_blank" className="opacity-50 hover:opacity-100">
                                        <i className="fab fa-twitter" />
                                    </a>
                                    <a href="/twitter" target="_blank" className="opacity-50 hover:opacity-100">
                                        <i className="fab fa-discord" />
                                    </a>
                                    <a href="/twitter" target="_blank" className="opacity-50 hover:opacity-100">
                                        <i className="fab fa-github" />
                                    </a>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
