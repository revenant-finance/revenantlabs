import { CreditumAppWrapper } from '../../components/Creditum/CreditumAppWrapper'
import CreditumMarkets from '../../components/Creditum/CreditumMarkets'
import { CreditumDataWrapper } from '../../hooks/Creditum/useCreditumData'

export default function Creditum() {
    return (
        <CreditumAppWrapper>
            <CreditumDataWrapper>
                <CreditumMarkets />
            </CreditumDataWrapper>
        </CreditumAppWrapper>
    )
}
