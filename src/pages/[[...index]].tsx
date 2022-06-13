import { useRouter } from 'next/router'
import { AppWrapper } from '../components/AppWrapper'
import SingularityLiquidity from '../components/liquidity'
import Swapper from '../components/swap/Swapper'

export function getServerSideProps(ctx) {
    return { props: { query: ctx.query } }
}

export default function SingularityPages({ query }) {
    const router = useRouter()
    const pageName = query.index?.[0] || 'swapper'

    const Component = () => {
        switch (pageName) {
            case 'swapper':
                return <Swapper />
            case 'liquidity':
                return <SingularityLiquidity />
            default:
                router.push('/404')
                return <></>
        }
    }

    return (
        <AppWrapper>
            <Component />
        </AppWrapper>
    )
}
