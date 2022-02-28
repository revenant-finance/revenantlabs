import { CreditumAppWrapper } from '../../components/Creditum/CreditumAppWrapper'
import CreditumLocking from '../../components/Creditum/CreditumLocking'
import { CreditumDataWrapper } from '../../hooks/Creditum/useCreditumData'

export default function Creditum() {
    return (
        <CreditumAppWrapper>
            <CreditumDataWrapper>
                <CreditumLocking />
            </CreditumDataWrapper>
        </CreditumAppWrapper>
    )
}
