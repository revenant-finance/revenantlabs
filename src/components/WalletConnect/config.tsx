import { Config, ConnectorNames } from './types'

const connectors: Config[] = [
    {
        title: 'Metamask',
        icon: '/img/wallets/metamask.svg',
        connectorId: ConnectorNames.Injected
    },
    {
        title: 'TrustWallet',
        icon: '/img/wallets/trust-wallet.svg',
        connectorId: ConnectorNames.Injected
    },
    {
        title: 'WalletConnect',
        icon: '/img/wallets/wallet-connect.svg',
        connectorId: ConnectorNames.WalletConnect
    },
    {
        title: 'Coinbase Wallet',
        icon: '/img/wallets/coinbase.svg',
        connectorId: ConnectorNames.WalletLink
    }
]

export default connectors
export const connectorLocalStorageKey = 'connectorId'
