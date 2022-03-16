import { useActiveWeb3React } from '../hooks'
import useAuth from '../hooks/useAuth'
import Button from './Button'

const ConnectWalletFirstButton = ({ children }) => {
    const { account, library } = useActiveWeb3React()
    const { login } = useAuth()

    return (
        <>
            {!account && (
                <Button
                    onClick={() => login()}
                    className="bg-yellow-400 text-neutral-900 whitespace-nowrap"
                >
                    Connect Wallet
                </Button>
            )}

            {account && children}
        </>
    )
}

export default ConnectWalletFirstButton
