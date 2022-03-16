import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import ConnectWalletButton from './WalletConnect/ConnectWalletButton'

export default function Navigation() {
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
            <div className="fixed top-0 right-0 z-50 flex flex-col items-end w-full max-w-lg gap-2 p-6 pointer-events-none">
                <div className="flex gap-2">
                    <ConnectWalletButton />
                    <button
                        onClick={() => setOpen((_) => !_)}
                        className={classNames(
                            'pointer-events-auto bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-4 py-2 shadow-2xl'
                        )}
                    >
                        <i
                            className={classNames(
                                'fas fa-bars transition ease-in-out duration-75',
                                open && 'rotate-90 text-salmon'
                            )}
                        ></i>
                    </button>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ x: '120%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '120%' }}
                            className="w-full max-w-xs p-6 space-y-4 border-2 shadow-2xl pointer-events-auto bg-neutral-900 border-neutral-800 rounded-2xl"
                        >
                            <div className="flex flex-col gap-1">
                                <Link href="/" passHref>
                                    <a className="text-xl font-extrabold uppercase transition ease-in-out opacity-75 font-montserrat hover:opacity-100">
                                        Go Home
                                    </a>
                                </Link>
                                {/* <Link href={'/singularity?from=wftm&to=credit'} passHref>
                                    <a className="text-3xl font-extrabold uppercase transition ease-in-out opacity-75 font-montserrat hover:opacity-100">
                                        Get Tokens
                                    </a>
                                </Link> */}
                            </div>

                            <div className="space-y-2">
                                <Link href="/creditum">
                                    <a
                                        className="block p-2 font-medium text-center rounded text-neutral-900 bg-gradient-to-tr from-salmon to-bluey"
                                        href=""
                                    >
                                        Open <b>Creditum</b>
                                    </a>
                                </Link>
                                {/* <Link href="/singularity">
                                    <a
                                        className="block p-2 font-medium text-center rounded text-neutral-900 bg-purp"
                                        href=""
                                    >
                                        Open <b>Singularity</b>
                                    </a>
                                </Link> */}
                            </div>

                            <div className="flex items-center">
                                <p className="flex-1">
                                    <Link href="/docs" passHref>
                                        <a
                                            className="font-medium opacity-50 hover:opacity-100"
                                            target="_blank"
                                        >
                                            Docs
                                        </a>
                                    </Link>
                                </p>
                                <p className="space-x-2">
                                    <a
                                        href="/twitter"
                                        target="_blank"
                                        className="opacity-50 hover:opacity-100"
                                    >
                                        <i className="fab fa-twitter" />
                                    </a>
                                    <a
                                        href="/discord"
                                        target="_blank"
                                        className="opacity-50 hover:opacity-100"
                                    >
                                        <i className="fab fa-discord" />
                                    </a>
                                    <a
                                        href="/github"
                                        target="_blank"
                                        className="opacity-50 hover:opacity-100"
                                    >
                                        <i className="fab fa-github" />
                                    </a>
                                    <a
                                        href="/medium"
                                        target="_blank"
                                        className="opacity-50 hover:opacity-100"
                                    >
                                        <i className="fab fa-medium" />
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
