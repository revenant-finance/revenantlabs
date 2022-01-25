import { motion } from 'framer-motion'
import Banner from '../components/Banner'
import CallToAction from '../components/CallToAction'
import Footer from '../components/Footer'
import RvntClaim from '../components/RvntClaim'

export default function IndexPage() {
    return (
        <>
            <Banner />

            <div className="p-6 pt-12 md:pt-24 pb-0 space-y-12 -mb-24 md:-mb-48 md:space-y-24 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="space-y-2 flex-1">
                            <p className="text-3xl md:text-7xl font-montserrat uppercase">
                                <span className="text-blue-500 font-extrabold">Revenant</span>
                                <span className="text-orange-500">Labs</span>
                            </p>
                            <p className="text-2xl md:text-4xl font-light max-w-lg">
                                Revenant is pushing the boundaries of what is possible with DeFi by building tools to empower <span className="bg-orange-500 text-neutral-900 whitespace-nowrap">soverign cash</span> on the
                                worlds fastest blockchain.
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl space-x-2">
                                <a href="/twitter" target="_blank">
                                    <i className="fab fa-twitter" />
                                </a>
                                <a href="/twitter" target="_blank">
                                    <i className="fab fa-discord" />
                                </a>
                                <a href="/twitter" target="_blank">
                                    <i className="fab fa-github" />
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a
                            href=""
                            target="_blank"
                            className="bg-orange-500 text-white rounded-2xl p-6 md:p-12 h-96 bg-center bg-cover flex flex-col justify-end shadow-2xl hover ease-in-out duration-300 hover:-translate-y-2"
                            style={{ backgroundImage: `url("/img/orange-banner.jpg")` }}
                        >
                            <div className="md:max-w-sm space-y-2">
                                <p className="font-montserrat text-3xl font-extrabold uppercase">Creditum</p>
                                <p className="text-xl">Creditum is Est fugiat velit eiusmod irure amet ad exercitation pariatur. Labore sunt amet ex eu incididunt occaecat id adipis.</p>
                            </div>
                        </a>

                        <a
                            href=""
                            target="_blank"
                            className="bg-blue-500 text-white rounded-2xl p-6 md:p-12 h-96 bg-center bg-cover flex flex-col justify-end shadow-2xl hover ease-in-out duration-300 hover:-translate-y-2"
                            style={{ backgroundImage: `url("/img/blue-banner.jpg")` }}
                        >
                            <div className="md:max-w-sm space-y-2 ">
                                <p className="font-montserrat text-3xl font-extrabold uppercase">Singularity</p>
                                <p className="text-xl">Creditum is Est fugiat velit eiusmod irure amet ad exercitation pariatur. Labore sunt amet ex eu incididunt occaecat id adipis.</p>
                            </div>
                        </a>
                    </div>

                    <a
                        href=""
                        target="_blank"
                        className="bg-purple-500 max-w-5xl mx-auto text-white rounded-2xl p-6 md:p-12 bg-center bg-cover flex  shadow-2xl hover ease-in-out duration-300 hover:-translate-y-2"
                        // style={{ backgroundImage: `url("/img/orange-banner.jpg")` }}
                    >
                        <div className="flex-1">
                            <div className="md:max-w-lg flex-1 space-y-2">
                                <p className="font-montserrat text-3xl font-extrabold uppercase">Join the Community</p>
                                <p className="text-xl">The easiest way to get started is with help. We invite you to join our community, where we're available to answer any questions you might have.</p>
                            </div>
                        </div>

                        <div>
                            <i className="fab fa-discord text-7xl"></i>
                        </div>
                    </a>
                </div>
            </div>

            <div className="bg-neutral-700">
                <img src="/img/gray-slime-top.svg" alt="" />
            </div>

            <div className="bg-neutral-700">
                <div className="max-w-7xl container mx-auto p-6 py-24 md:py-48">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <img className="w-full" src="/img/online-payment.svg" alt="" />
                        </div>
                        <div className="space-y-8">
                            <p className="text-4xl md:text-7xl font-extrabold">Building with the community in mind.</p>
                            <div className="space-y-4">
                                <p className="text-xl">
                                    Our community-first approach to building tools is rooted in the belief that the most effective way to build is through collaboration. No matter your stakes, your voice is an important
                                    part of our vision.
                                </p>
                                <p className="text-xl">
                                    Ipsum dolor nulla magna sit nisi veniam ut id nisi sint eiusmod amet occaecat laboris. Lorem magna amet eiusmod irure proident. Anim quis nisi sunt cupidatat. Et fugiat magna ut qui.
                                    Fugiat consectetur aliqua pariatur anim ipsum esse irure incididunt qui deserunt nostrud. Velit ut ut exercitation cupidatat culpa minim pariatur.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <CallToAction /> */}

            <div className="bg-blue-900 text-blue-100 bg-center bg-cover" style={{ backgroundImage: `url("/img/blue-mesh-dark.jpg")` }}>
                <div className="max-w-3xl container mx-auto p-6 py-24 md:py-48 space-y-12">
                    <motion.img animate={{ y: [0, -10, 0] }} transition={{ loop: Infinity, duration: 3 }} className="w-64 mx-auto" src="/img/ftm-logo.svg" alt="" />

                    <div className="space-y-8">
                        <p className="text-4xl md:text-6xl font-extrabold">Powered by the worlds fastest and most efficient blockchain.</p>
                        <div className="space-y-4">
                            <p className="text-xl">
                                Our products are deployed on the Fantom Blockchain — known for nearly instant, cheap, and safe transactions. Avoid Ethereum's slow wait times and high gas fees, while utilizing your same
                                assets. It's that simple.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <RvntClaim />

            <Footer />
        </>
    )
}
