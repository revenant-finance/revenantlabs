import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from '../Button'
import useSingularityLiquidity from '../../hooks/useSingularityLiquidity'
import * as constants from '../../data'

const tokens = constants.CONTRACT_SINGULARITY[250].traunches.safe.tokens

export function SingularityHeaderItem({ href, children }) {
    const router = useRouter()
    const isActive = router.asPath.split('?')[0] === href

    return (
        <Link href={href} passHref>
            <a
                className={classNames(
                    'font-medium',
                    isActive &&
                        'bg-gradient-to-br from-purple-500 to-blue-500 text-transparent bg-clip-text'
                )}
            >
                {children}
            </a>
        </Link>
    )
}

export function SingularityMintTest() {
    const { mintTestToken } = useSingularityLiquidity()
    
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-4 p-6">
                <div className="flex">Disclaimer: This version of the app is in beta. Tokens being used for liquidity providing and swapping are test tokens that follow real-token oracle prices. You can mint these test tokens here:</div>   
                <div className="flex gap-2">
                    <Button className="shadow bg-gradient-to-br from-purple-900 to-blue-900" onClick={() => mintTestToken(tokens.btc, '1')}>
                        Mint 1 testBTC
                    </Button>
                    <Button className="shadow bg-gradient-to-br from-purple-900 to-blue-900" onClick={() => mintTestToken(tokens.eth, '10')}>
                        Mint 10 testEth
                    </Button>
                    <Button className="shadow bg-gradient-to-br from-purple-900 to-blue-900" onClick={() => mintTestToken(tokens.usdc, '10000')}>
                        Mint 10000 testUSDC
                    </Button>
                </div>
            </div>
        </>
    )
}

export default function SingularityHeader() {
    return (
        <>
            <div className="flex flex-col items-center justify-center gap-4 p-10">
                <div className="relative z-10 flex gap-4 px-6 py-3 bg-opacity-75 border-2 shadow-2xl bg-neutral-900 border-neutral-800 rounded-3xl">
                    <SingularityHeaderItem href="/singularity">Swap</SingularityHeaderItem>
                    <SingularityHeaderItem href="/singularity/liquidity">
                        Liquidity
                    </SingularityHeaderItem>
                </div>
                <div className="relative z-10 flex gap-4 px-6 py-3 bg-opacity-75 border-2 shadow-2xl bg-neutral-900 border-neutral-800 rounded-3xl">
                    <SingularityMintTest />
                </div>
            </div>
        </>
    )
}
