import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import {
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
    WalletConnectConnector
} from '@web3-react/walletconnect-connector'
import { useCallback } from 'react'
import { connectorLocalStorageKey } from '.'
import { ConnectorNames, connectorsByName } from '../connectors'
import useAlerts from './useAlerts'

export default function useAuth() {
    const { activate, deactivate } = useWeb3React()
    const { newAlert } = useAlerts()

    const login = useCallback((connectorID: ConnectorNames) => {
        const connector = connectorsByName[connectorID]

        if (connector) {
            activate(connector, async (error: Error) => {
                window.localStorage.removeItem(connectorLocalStorageKey)
                if (error instanceof UnsupportedChainIdError) {
                    newAlert({
                        title: 'Unsupported Chain Id Error',
                        subtitle: 'Check your chain Id!',
                        mood: 'negative'
                    })
                } else if (error instanceof NoEthereumProviderError) {
                    newAlert({ title: 'No provider was found!', mood: 'negative' })
                } else if (
                    error instanceof UserRejectedRequestErrorInjected ||
                    error instanceof UserRejectedRequestErrorWalletConnect
                ) {
                    if (connector instanceof WalletConnectConnector) {
                        const walletConnector = connector as WalletConnectConnector
                        walletConnector.walletConnectProvider = null
                    }
                    newAlert({
                        title: 'Authorization Error',
                        subtitle: 'Please authorize to access your account',
                        mood: 'negative'
                    })
                    console.log('Authorization Error, Please authorize to access your account')
                } else {
                    newAlert({ title: error.message, mood: 'negative' })
                    console.log(error.name, error.message)
                }
            })
        } else {
            newAlert({
                title: "Can't find connector",
                subtitle: 'The connector config is wrong',
                mood: 'negative'
            })
            console.log("Can't find connector", 'The connector config is wrong')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { login, logout: deactivate }
}
