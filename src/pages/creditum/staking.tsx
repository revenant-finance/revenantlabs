import { CreditumAppWrapper } from '../../components/Creditum/CreditumAppWrapper'
import CreditumMarkets from '../../components/Creditum/CreditumMarkets'
import CreditumStaking from '../../components/Creditum/CreditumStaking'
import { CreditumDataWrapper } from '../../hooks/Creditum/useCreditumData'

export default function Creditum() {
    return (
        <CreditumAppWrapper>
            <CreditumDataWrapper>
                <CreditumStaking />
            </CreditumDataWrapper>
        </CreditumAppWrapper>
    )
}
