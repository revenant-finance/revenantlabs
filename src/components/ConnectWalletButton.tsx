import Button from './Button'
import { useActiveWeb3React } from '../hooks'

const ConnectWalletButton = ({ children }) => {
    const { account, library} = useActiveWeb3React()

    return (
        <>
            {/* {!account && (
                <Button onClick={() => wallet.connect()} className="bg-yellow-400 text-neutral-900 whitespace-nowrap">
                    Connect Wallet
                </Button>
            )} */}

            {account && children}
        </>
    )
}

export default ConnectWalletButton
