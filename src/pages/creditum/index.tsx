import { CreditumDataWrapper } from '../../hooks/Creditum/useCreditumData'
import { FarmDataWrapper } from '../../hooks/Creditum/useFarmData'

export default function CreditumIndexPage() {
    return (
        <>
            <CreditumDataWrapper>
                {/* <FarmDataWrapper> */}
                    <div className="w-full h-full p-6 py-24 bg-center bg-cover">
                            creditum
                    </div>
                {/* </FarmDataWrapper> */}
            </CreditumDataWrapper>
        </>
    )
}
