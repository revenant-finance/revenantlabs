import { motion } from 'framer-motion'
import Link from 'next/link'
import HomepageBackground from '../components/HomepageBackground'
import RvntClaim from '../components/RvntClaim'

export default function Index() {
    return (
        <>
            <HomepageBackground />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 2 }}
                className="relative max-w-2xl p-12 mx-auto space-y-12 lg:max-w-screen-2xl lg:p-24"
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <img className="w-32" src="/img/revenant-coin.png" alt="" />
                    {/* <div className="flex-1 hidden lg:block"></div>
                    <div className="hidden gap-4 text-xl lg:flex whitespace-nowrap">
                        <a className="opacity-50 hover:opacity-100" href="/twitter" target="_blank">
                            <i className="fab fa-twitter" />
                        </a>
                        <a className="opacity-50 hover:opacity-100" href="/discord" target="_blank">
                            <i className="fab fa-discord" />
                        </a>
                        <a className="opacity-50 hover:opacity-100" href="/github" target="_blank">
                            <i className="fab fa-github" />
                        </a>
                        <a className="opacity-50 hover:opacity-100" href="/medium" target="_blank">
                            <i className="fab fa-medium" />
                        </a>
                    </div> */}
                </div>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <div className="space-y-8">
                        <p className="text-4xl font-medium lg:text-7xl font-extended">
                            Welcome to{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-salmon to-purp">
                                Revenant Labs
                            </span>
                            . DeFi-suite on Fantom.
                        </p>
                        <p className="text-xl opacity-50 lg:text-2xl">
                            Revenant is pushing the boundaries of what is possible with DeFi by
                            building tools to empower sovereign cash on the worlds fastest
                            blockchain.
                        </p>
                        <div className="flex flex-wrap gap-4 whitespace-nowrap">
                            <Link href="/creditum" passHref>
                                <a className="px-6 py-2 font-medium rounded-full shadow-2xl bg-gradient-to-br text-neutral-900 from-salmon to-purp md:text-xl">
                                    Open Creditum
                                </a>
                            </Link>
                            <Link href="/singularity" passHref>
                                <a className="px-6 py-2 font-medium rounded-full shadow-2xl bg-gradient-to-br text-neutral-900 from-salmon to-purp md:text-xl">
                                    Open Singularity
                                </a>
                            </Link>

                            <RvntClaim />
                        </div>

                        {/* <div className="flex flex-wrap gap-6">
                            <div className="space-y-1">
                                <p className="text-2xl lg:text-4xl font-extended">
                                    1.3<span className="text-purp">K+</span>
                                </p>
                                <p className="text-xs opacity-50 lg:text-base">Active Users</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl lg:text-4xl font-extended">
                                    $37<span className="text-purp">M+</span>
                                </p>
                                <p className="text-xs opacity-50 lg:text-base">
                                    Locked Across Protocols
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl lg:text-4xl font-extended">
                                    +<i className="fas fa-infinity text-purp"></i>
                                </p>
                                <p className="text-xs opacity-50 lg:text-base">Passion for DeFi</p>
                            </div>
                        </div> */}
                        <div className="flex justify-between">
                            <div className="space-x-2 text-xl">
                                <a
                                    className="opacity-50 hover:opacity-100"
                                    href="/twitter"
                                    target="_blank"
                                >
                                    <i className="fab fa-twitter" />
                                </a>
                                <a
                                    className="opacity-50 hover:opacity-100"
                                    href="/discord"
                                    target="_blank"
                                >
                                    <i className="fab fa-discord" />
                                </a>
                                <a
                                    className="opacity-50 hover:opacity-100"
                                    href="/github"
                                    target="_blank"
                                >
                                    <i className="fab fa-github" />
                                </a>
                                <a
                                    className="opacity-50 hover:opacity-100"
                                    href="/medium"
                                    target="_blank"
                                >
                                    <i className="fab fa-medium" />
                                </a>
                                <a
                                    className="opacity-50 hover:opacity-100"
                                    href="/medium"
                                    target="_blank"
                                >
                                    ImmuneFi
                                </a>
                            </div>
                            <div className="space-x-2 text-xl">
                                <a
                                    className="opacity-50 hover:opacity-100"
                                    href="/medium"
                                    target="_blank"
                                >
                                    Docs
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <motion.img
                            animate={{ rotate: ['2deg', '-2deg', '2deg'], scale: [1, 1.1, 1] }}
                            transition={{ duration: 6, loop: Infinity }}
                            src="/img/3d-peggy.png"
                            alt=""
                        />
                    </div>
                </div>
            </motion.div>
        </>
    )
}
