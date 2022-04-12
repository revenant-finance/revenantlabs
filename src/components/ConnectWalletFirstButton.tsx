import { useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import Button from './Button'
import useAuth from '../hooks/useAuth'
import ConnectWalletModal from './WalletConnect/ConnectWalletModal'
import classNames from 'classnames'


const ConnectWalletFirstButton = ({ children, type = "creditum" }) => {
    const { account, library } = useActiveWeb3React()
    const [connectModalOpen, setConnectModalOpen] = useState(false)
    const { login } = useAuth()
    const singularity = 'shadow bg-gradient-to-br from-purple-900 to-blue-900'
    const creditum = 'bg-yellow-400 text-neutral-900 whitespace-nowrap'
    const btnColor = type === 'singularity' ? singularity : creditum

    return (
        <>
            {!account && (
                <Button
                    onClick={() => setConnectModalOpen((_) => !_)}
                    className={btnColor}
                >
                    Connect Wallet
                </Button>
            )}
        <ConnectWalletModal
            open={connectModalOpen}
            login={login}
            onDismiss={() => setConnectModalOpen(false)}
        />

            {account && children}
        </>
    )
}

export default ConnectWalletFirstButton
