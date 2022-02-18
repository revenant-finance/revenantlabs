import { createWeb3ReactRoot } from '@web3-react/core'
import { NetworkContextName } from '../hooks'
import { RefreshContextProvider } from '../contexts/RefreshContext'

const Web3ReactProviderDefault = createWeb3ReactRoot(NetworkContextName)

const Web3ReactProviderDefaultSSR = ({ children, getLibrary }) => {
  return (
    <Web3ReactProviderDefault getLibrary={getLibrary}>
        <RefreshContextProvider>
            {children}
        </RefreshContextProvider>
    </Web3ReactProviderDefault>
  )
}

export default Web3ReactProviderDefaultSSR;