import Footer from '../components/Footer'
import RvntClaim from '../components/RvntClaim'

export default function IndexPage() {
    return (
        <>
            <div className="bg-orange-500 text-neutral-900">
                <div className="max-w-7xl mx-auto p-2">
                    <p className="text-xs font-medium md:text-center whitespace-nowrap overflow-auto no-scrollbar">
                        Tools found on here are not without risk.{' '}
                        <a href="#" className="underline hover:no-underline">
                            Read more &rarr;
                        </a>
                    </p>
                </div>
            </div>
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
                            className="bg-orange-500 text-white rounded-2xl p-6 md:p-12 h-96 bg-center bg-cover flex flex-col justify-end shadow-2xl hover ease-in-out duration-300 hover:-translate-y-4"
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
                            className="bg-blue-500 text-white rounded-2xl p-6 md:p-12 h-96 bg-center bg-cover flex flex-col justify-end shadow-2xl hover ease-in-out duration-300 hover:-translate-y-4"
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
                        className="bg-purple-500 max-w-5xl mx-auto text-white rounded-2xl p-6 md:p-12 bg-center bg-cover flex flex-col justify-end shadow-2xl hover ease-in-out duration-300 hover:-translate-y-4"
                        // style={{ backgroundImage: `url("/img/orange-banner.jpg")` }}
                    >
                        <div className="md:max-w-sm space-y-2">
                            <p className="font-montserrat text-3xl font-extrabold uppercase">Get Started</p>
                            <p className="text-xl">Creditum is Est fugiat velit eiusmod irure amet ad exercitation pariatur. Labore sunt amet ex eu incididunt occaecat id adipis.</p>
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
                                    In officia veniam excepteur et dolore officia veniam nostrud ea deserunt commodo fugiat quis proident. Laborum laborum laborum qui irure laborum consequat qui tempor laboris sunt
                                    nostrud ad non. Et esse minim dolor culpa cillum duis occaecat enim anim dolor.
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

            <div className="bg-blue-500 text-white">
                <div className="max-w-7xl container mx-auto p-6 py-24 md:py-48">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                        <div className="space-y-8">
                            <p className="text-4xl md:text-6xl font-extrabold">Powered by the worlds fastest and most efficient blockchain.</p>
                            <div className="space-y-4">
                                <p className="text-xl">
                                    Eiusmod ipsum veniam fugiat in duis voluptate excepteur sunt consequat veniam. Pariatur veniam quis do deserunt aute cillum cupidatat quis voluptate consequat ullamco anim. Velit nulla
                                    do laboris nisi. Id non nostrud pariatur anim aliqua est occaecat excepteur fugiat cillum consequat quis. Sint laborum proident magna non enim et adipisicing. Sit ex dolor nulla veniam
                                    pariatur.
                                </p>
                            </div>
                        </div>
                        <div>
                            <img className="w-full" src="/img/ftm-logo.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <RvntClaim />

            <Footer />
        </>
    )
}
