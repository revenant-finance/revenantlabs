import { CreditumAppWrapper } from '../../Creditum/CreditumAppWrapper'
import CreditumLocking from '../../Creditum/CreditumLocking/CreditumLocking'

export default function Creditum() {
    return (
        <CreditumAppWrapper>
            <CreditumLocking />
        </CreditumAppWrapper>
    )
}
