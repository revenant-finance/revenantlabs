import Link from 'next/link'
import HeaderLink from './HeaderLink'

export default function CredtiumHeader() {
    return (
        <div className="w-full p-6 pb-0 mx-auto space-y-2 max-w-7xl md:pt-12">
            <div className="flex flex-col gap-2 md:flex-row">
                <Link href="/creditum" passHref>
                    <a>
                        <img className="w-24 md:w-16" src="/img/creditum.png" alt="" />
                    </a>
                </Link>
                <div className="flex-1 hidden md:block" />
                <div className="flex space-x-2 font-medium whitespace-nowrap no-scrollbar">
                    <HeaderLink href="/creditum" icon="fa-solid fa-magnifying-glass-dollar">
                        Market
                    </HeaderLink>
                    <HeaderLink href="/creditum/stabilizer" icon="fa-solid fa-tractor">
                        Stabilizer
                    </HeaderLink>
                    <HeaderLink href="/creditum/farms" icon="fa-solid fa-tractor">
                        Farms
                    </HeaderLink>
                    <HeaderLink href="/creditum/locking" icon="fa-solid fa-vault">
                        Locking
                    </HeaderLink>
                </div>
            </div>
        </div>
    )
}
