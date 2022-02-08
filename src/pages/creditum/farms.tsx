import { CreditumAppWrapper } from '../../components/Creditum/CreditumAppWrapper'
import CreditumFarms from '../../components/Creditum/CreditumFarms'
import { FarmDataWrapper } from '../../hooks/Creditum/useFarmData'

export default function Creditum() {
    return (
        <CreditumAppWrapper>
            <FarmDataWrapper>
                <CreditumFarms />
            </FarmDataWrapper>
        </CreditumAppWrapper>
    )
}
