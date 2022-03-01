import { motion } from 'framer-motion'
import Link from 'next/link'
import Footer from '../components/Footer'
import RvntClaim from '../components/RvntClaim'

export default function IndexPage() {
    return (
        <>
            {/* <Banner /> */}

            <div className="relative z-10 p-6 pt-12 pb-0 -mb-24 space-y-12 md:pt-24 md:-mb-48 md:space-y-24">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex-1 space-y-2">
                            <motion.img animate={{ rotate: ['0%', '100%', '0%'] }} transition={{ duration: 12, loop: Infinity }} className="w-32" src="/img/revenant-coin.png" alt="" />

                            <p className="text-3xl uppercase md:text-7xl font-montserrat">
                                <span className="font-extrabold text-purp">Revenant</span>
                                <span className="text-salmon">Labs</span>
                            </p>
                            <p className="max-w-lg text-2xl font-light md:text-4xl">
                                Revenant is pushing the boundaries of what is possible with DeFi by building tools to empower <span className="bg-salmon text-neutral-900">sovereign cash</span> on the worlds fastest blockchain.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="flex-1 space-x-2 text-2xl">
                                <a href="/docs" target="_blank" className="underline">
                                    Docs
                                </a>
                                <a href="/twitter" target="_blank">
                                    <i className="fab fa-twitter" />
                                </a>
                                <a href="/discord" target="_blank">
                                    <i className="fab fa-discord" />
                                </a>
                                <a href="/github" target="_blank">
                                    <i className="fab fa-github" />
                                </a>
                                <a href="/medium" target="_blank">
                                    <i className="fab fa-medium" />
                                </a>
                            </p>
                            {/* <img className="hidden w-32 md:block" src="/img/revenant-full.png" alt="" /> */}
                        </div>
                    </div>
                </div>

                <div className="container mx-auto space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Link href="/creditum" passHref>
                            <a className="relative flex flex-col justify-end p-6 overflow-hidden duration-300 ease-in-out bg-center bg-cover shadow-2xl bg-yellowy text-neutral-900 rounded-2xl md:p-12 h-96 hover hover:-translate-y-2">
                                <img className="absolute w-16 right-6 top-6 md:right-12 md:top-12 opacity-10" src="/img/creditum-black.png" alt="" />
                                <div className="relative space-y-2 md:max-w-sm">
                                    <p className="text-3xl font-extrabold uppercase font-montserrat">Creditum</p>
                                    <p className="text-xl">Creditum is a Revenant Labs protocol that provides fixed interest rates loans to mint cUSD</p>
                                </div>
                            </a>
                        </Link>

                        {/* <Link href="/singularity" passHref> */}
                        <a className="relative flex flex-col justify-end p-6 overflow-hidden duration-300 ease-in-out bg-center bg-cover shadow-2xl bg-purp text-neutral-900 rounded-2xl md:p-12 h-96 hover hover:-translate-y-2 group">
                            <div className="absolute inset-0 z-10 flex items-center justify-center p-6 transition ease-in-out opacity-0 group-hover:opacity-100 bg-neutral-900 bg-opacity-90">
                                <p className="space-x-2 text-white uppercase opacity-50 font-extended">
                                    <i className="fas fa-lock"></i>
                                    <span>Coming soon.</span>
                                </p>
                            </div>
                            {/* <MeshBackground id="singularity-gradient-colors" /> */}
                            <img className="absolute w-16 right-6 top-6 md:right-12 md:top-12 opacity-10" src="/img/singularity-black.png" alt="" />

                            <div className="relative space-y-2 md:max-w-sm ">
                                <p className="text-3xl font-extrabold uppercase font-montserrat">Singularity</p>
                                <p className="text-xl">Singularity is a decentralized exchange that provides the best swap rates on stablecoins</p>
                            </div>
                        </a>
                        {/* </Link> */}
                    </div>

                    <a
                        href="https://discord.gg/aDmKM7E7SY"
                        target="_blank"
                        className="flex max-w-5xl p-6 mx-auto duration-300 ease-in-out bg-center bg-cover shadow-2xl bg-neutral-600 rounded-2xl md:p-12 hover hover:-translate-y-2"
                        // style={{ backgroundImage: `url("/img/orange-banner.jpg")` }}
                    >
                        <div className="flex-1">
                            <div className="flex-1 space-y-2 md:max-w-lg">
                                <p className="text-3xl font-extrabold uppercase font-montserrat">Join the Community</p>
                                <p className="text-xl">The easiest way to get started is with help. We invite you to join our community, where we're available to answer any questions you might have.</p>
                            </div>
                        </div>

                        <div>
                            <i className="fab fa-discord text-7xl" />
                        </div>
                    </a>
                </div>
            </div>

            <div className="bg-neutral-700">
                <img src="/img/gray-slime-top.svg" alt="" />
            </div>

            <div className="bg-neutral-700">
                <div className="container p-6 py-24 mx-auto max-w-7xl md:py-48">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
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

            {/* <CallToAction /> */}

            {/* <div className="text-yellow-100 bg-yellow-900 bg-center bg-cover" style={{ backgroundImage: `url("/img/blue-mesh-dark.jpg")` }}>
                <div className="container max-w-3xl p-6 py-24 mx-auto space-y-12 md:py-48">
                    <motion.img animate={{ y: [0, -10, 0] }} transition={{ loop: Infinity, duration: 3 }} className="w-64 mx-auto" src="/img/ftm-logo.svg" alt="" />

                    <div className="space-y-8">
                        <p className="text-4xl font-extrabold md:text-6xl">Powered by the worlds fastest and most efficient blockchain.</p>
                        <div className="space-y-4">
                            <p className="text-xl">Our products are deployed on the Fantom Blockchain — known for nearly instant, cheap, and safe transactions. Avoid Ethereum's slow wait times and high gas fees, while utilizing your same assets. It's that simple.</p>
                        </div>
                    </div>
                </div>
            </div> */}

            <RvntClaim />

            <Footer />
        </>
    )
}
