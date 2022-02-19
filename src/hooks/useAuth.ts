import { useCallback } from 'react'
import { useToasts } from '@geist-ui/react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { connectorsByName, ConnectorNames } from '../connectors'
import { connectorLocalStorageKey } from '.'

export default function useAuth() {
    const { activate, deactivate } = useWeb3React()
    const [, setToast] = useToasts()

    const login = useCallback((connectorID: ConnectorNames) => {
        const connector = connectorsByName[connectorID]

        if (connector) {
            activate(connector, async (error: Error) => {
                window.localStorage.removeItem(connectorLocalStorageKey)
                if (error instanceof UnsupportedChainIdError) {
                    setToast({ text: 'Unsupported Chain Id Error. Check your chain Id!', type: 'error' })
                } else if (error instanceof NoEthereumProviderError) {
                    setToast({ text: 'No provider was found!', type: 'error' })
                } else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
                    if (connector instanceof WalletConnectConnector) {
                        const walletConnector = connector as WalletConnectConnector
                        walletConnector.walletConnectProvider = null
                    }
                    setToast({ text: 'Authorization Error, Please authorize to access your account', type: 'error' })
                    console.log('Authorization Error, Please authorize to access your account')
                } else {
                    setToast({ text: error.message, type: 'error' })
                    console.log(error.name, error.message)
                }
            })
        } else {
            setToast({ text: "Can't find connector, The connector config is wrong", type: 'error' })
            console.log("Can't find connector", 'The connector config is wrong')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { login, logout: deactivate }
}

// import { useCallback } from 'react'
// import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
// import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
// import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { connectorsByName, ConnectorNames } from '../connectors'
// import { connectorLocalStorageKey } from '.'
// import useAlerts from './useAlerts'

// export default function useAuth() {
//     const { activate, deactivate } = useWeb3React()
//     const { newAlert } = useAlerts()

//     const login = useCallback((connectorID: ConnectorNames) => {
//         const connector = connectorsByName[connectorID]
//         console.log(2)
//         if (connector) {
//             activate(connector, async (error: Error) => {
//                 window.localStorage.removeItem(connectorLocalStorageKey)
//                 if (error instanceof UnsupportedChainIdError) {
//                     newAlert({ title: 'Cannot Connect To Wallet', subtitle: 'Unsupported Chain Id Error. Check your chain Id!', mood: 'negative' })
//                 } else if (error instanceof NoEthereumProviderError) {
//                     newAlert({ title: 'Cannot Connect To Wallet', subtitle: 'No provider was found!', mood: 'negative' })
//                 } else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
//                     if (connector instanceof WalletConnectConnector) {
//                         const walletConnector = connector as WalletConnectConnector
//                         walletConnector.walletConnectProvider = null
//                     }
//                     newAlert({ title: 'Cannot Connect To Wallet', subtitle: 'Authorization Error, Please authorize to access your account', mood: 'negative' })
//                     console.log('Authorization Error, Please authorize to access your account')
//                 } else {
//                     newAlert({ title: 'Cannot Connect To Wallet', subtitle: error.message, mood: 'negative' })
//                     console.log(error.name, error.message)
//                 }
//             })
//         } else {
//             newAlert({ title: 'Cannot Connect To Wallet', subtitle: "Can't find connector, The connector config is wrong", mood: 'negative' })
//             console.log("Can't find connector", 'The connector config is wrong')
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     return { login, logout: deactivate }
// }