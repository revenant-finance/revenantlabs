import { useRouter } from 'next/router'
import { SingularityAppWrapper } from '../../Singularity/SingularityAppWrapper'
import SingularityLiquidity from '../../Singularity/SingularityLiquidity'
import SingularitySwapper from '../../Singularity/SingularitySwap/SingularitySwapper'

export function getServerSideProps(ctx) {
    return { props: { query: ctx.query } }
}

export default function SingularityPages({ query }) {
    const router = useRouter()
    const pageName = query.index?.[0] || 'swapper'

    const Component = () => {
        switch (pageName) {
            case 'swapper':
                return <SingularitySwapper />
            case 'liquidity':
                return <SingularityLiquidity />
            default:
                router.push('/404')
                return <></>
        }
    }

    return (
        <SingularityAppWrapper>
            <Component />
        </SingularityAppWrapper>
    )
}
