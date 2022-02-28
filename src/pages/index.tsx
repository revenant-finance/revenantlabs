import { motion } from 'framer-motion'
import Footer from '../components/Footer'

export default function Index() {
    return (
        <>
            <div className="h-full relative flex items-center justify-center text-yellow-100">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 to-blue-800 opacity-30" />

                <div className="max-w-7xl mx-auto p-12 py-24">
                    <div className="text-center space-y-8">
                        <motion.img animate={{ rotate: ['0deg', '360deg', '0deg'] }} transition={{ duration: 32, loop: Infinity }} className="w-32 mx-auto" src="/img/revenant-coin.png" alt="" />

                        <p className="text-3xl uppercase md:text-7xl font-montserrat">
                            <span className="font-extrabold text-purp">Revenant</span>
                            <span className="text-salmon">Labs</span>
                        </p>
                        <p className="mx-auto max-w-xl text-2xl font-light md:text-4xl">
                            Revenant is pushing the boundaries of what is possible with DeFi by building tools to empower <span className="bg-salmon text-neutral-900">sovereign cash</span> on the worlds fastest blockchain.
                        </p>

                        <p className="flex-1 space-x-2 text-2xl">
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
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tl from-green-500 to-yellow-500 opacity-60" />
                <div className="relative max-w-7xl mx-auto p-12 py-24 text-green-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <img className="w-full" src="/img/peggy/peggy-standing.png" alt="" />
                        </div>
                        <div className="space-y-8">
                            <p className="text-4xl font-extrabold md:text-7xl">Peggy is building with the community in mind.</p>
                            <div className="space-y-4">
                                <p className="text-xl">Our community-first approach to building tools is rooted in the belief that the most effective way to build is through collaboration. No matter your stakes, your voice is an important part of our vision.</p>
                                <p className="text-xl">Our team is semi-anonymous with members that have been building on Fantom since the beginning. Xam Pham, Shien110, Entropy, Xannie, Cript Walkin, and njRedDot are here to provide you with the best experience possible when working with our products.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900 to-blue-800 opacity-30" />

                <div className="relative max-w-7xl mx-auto p-12 py-24 text-yellow-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 ">
                            <p className="text-3xl uppercase md:text-5xl font-montserrat font-extrabold">Creditum</p>
                            <p className="text-2xl">Quis reprehenderit quis reprehenderit ut nisi anim nisi. Magna sit reprehenderit magna nostrud cillum pariatur voluptate. Velit eu proident veniam consectetur voluptate sint et labore id commodo ex consequat. Ad do eu do aliqua aliqua incididunt nulla fugiat proident.</p>
                        </div>
                        <div className="flex justify-end">
                            <img className="w-20 h-20" src="/img/creditum-white.png" alt="" />
                        </div>
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto p-12 py-24 text-yellow-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex">
                            <img className="w-20 h-20" src="/img/creditum-white.png" alt="" />
                        </div>
                        <div className="space-y-4 ">
                            <p className="text-3xl uppercase md:text-5xl font-montserrat font-extrabold">Singularity</p>
                            <p className="text-2xl">In aute occaecat ipsum aute dolore pariatur proident ut ad dolor enim. Tempor nostrud occaecat ullamco voluptate magna. Officia sunt tempor laboris anim.</p>
                        </div>
                    </div>
                </div>
            </div> */}

            <Footer />
        </>
    )
}
