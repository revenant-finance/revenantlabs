import { useWallet } from 'use-wallet'
import Button from './Button'

const ConnectWalletButton = ({ children }) => {
    const wallet = useWallet()

    return (
        <>
            {!wallet.account && (
                <Button onClick={() => wallet.connect()} className="bg-yellow-400 text-neutral-900 whitespace-nowrap">
                    Connect Wallet
                </Button>
            )}

            {wallet.account && children}
        </>
    )
}

export default ConnectWalletButton
