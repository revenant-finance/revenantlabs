import { CreditumAppWrapper } from '../../components/Creditum/CreditumAppWrapper'
import useCreditumData, { CreditumDataWrapper } from '../../hooks/Creditum/useCreditumData'
import useFarmData from '../../hooks/Creditum/useFarmData'
import { FarmDataWrapper } from '../../hooks/Creditum/useFarmData'
import CreditumMarkets from '../../components/Creditum/CreditumMarkets'

export default function Creditum() {
    return (
        <CreditumAppWrapper>
            <CreditumDataWrapper>
                <FarmDataWrapper>
                    <CreditumMarkets />
                </FarmDataWrapper>
            </CreditumDataWrapper>
        </CreditumAppWrapper>
    )
}
