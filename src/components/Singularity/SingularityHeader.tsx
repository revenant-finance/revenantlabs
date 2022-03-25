import Link from 'next/link'

export default function SingularityHeader() {
    return (
        <div className="flex justify-center items-center p-12">
            <div className="relative z-10 bg-neutral-900 inline-block">
                <Link href="/singularity" passHref>
                    <a>swap</a>
                </Link>{' '}
                <Link href="/singularity/liquidity" passHref>
                    <a>liqudity</a>
                </Link>
            </div>
        </div>
    )
}
