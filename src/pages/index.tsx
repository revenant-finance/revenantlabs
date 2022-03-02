import { motion } from 'framer-motion'
import HomepageBackground from '../components/HomepageBackground'

export default function Index() {
    return (
        <>
            <HomepageBackground />

            <div className="relative max-w-screen-2xl mx-auto p-12 md:p-24 space-y-12 md:space-y-24">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                    <img className="w-16" src="/img/revenant-coin.png" alt="" />
                    <div className="hidden lg:block flex-1"></div>
                    <div className="hidden lg:flex text-xl gap-4 whitespace-nowrap">
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
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <p className="text-4xl lg:text-7xl font-medium font-extended">
                            Welcome to{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-purple-800">
                                Revenant Labs
                            </span>
                            . DeFi-suite on Fantom.
                        </p>
                        <p className="opacity-50 text-xl lg:text-2xl">
                            Revenant is pushing the boundaries of what is possible with DeFi by
                            building tools to empower sovereign cash on the worlds fastest
                            blockchain.
                        </p>
                        <div className="flex gap-6">
                            <button className="px-6 py-3 bg-gradient-to-br text-purple-200 from-purple-400 to-purple-800 rounded-full font-medium text-xl shadow-2xl">
                                Open Creditum
                            </button>
                            {/* <button className="px-5 py-3 bg-gradient-to-br text-purple-200 from-purple-400 to-purple-800 rounded-2xl font-medium text-2xl shadow-2xl">
                                Open Creditum
                            </button> */}
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <div className="space-y-1">
                                <p className="text-2xl lg:text-4xl font-extended">37M+</p>
                                <p className="text-xs lg:text-base opacity-50">
                                    Across Protocol(s)
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl lg:text-4xl font-extended">37M+</p>
                                <p className="text-xs lg:text-base opacity-50">
                                    Across Protocol(s)
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl lg:text-4xl font-extended">37M+</p>
                                <p className="text-xs lg:text-base opacity-50">
                                    Across Protocol(s)
                                </p>
                            </div>
                        </div>
                        <div className="text-2xl space-x-2">
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
                        </div>
                    </div>
                    <div>
                        <motion.img
                            animate={{ rotate: ['2deg', '-2deg', '2deg'], scale: [1, 1.1, 1] }}
                            transition={{ duration: 6, loop: Infinity }}
                            src="/img/saly-36.png"
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
