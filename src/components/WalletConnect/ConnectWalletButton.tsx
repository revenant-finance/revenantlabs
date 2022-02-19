import classNames from 'classnames'
import { useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useAuth from '../../hooks/useAuth'
import ConnectWalletModal from './ConnectWalletModal'

export default function ConnectWalletButton(props) {
    const { account } = useActiveWeb3React()
    const { login, logout } = useAuth()
    const [connectModalOpen, setConnectModalOpen] = useState(false)

    return (
        <>
            <button onClick={() => setConnectModalOpen((_) => !_)} className={classNames('pointer-events-auto bg-neutral-900 border-2 border-neutral-800 rounded-2xl px-4 py-2 shadow-2xl')}>
                <i className={classNames('fas fa-wallet transition ease-in-out duration-75', account && 'text-salmon')}></i>
            </button>

            <ConnectWalletModal open={connectModalOpen} login={login} onDismiss={() => setConnectModalOpen(false)} />
        </>
    )
}
