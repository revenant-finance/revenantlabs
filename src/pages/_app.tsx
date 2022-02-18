import { Web3ReactProvider } from '@web3-react/core'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useEffect } from 'react'
import smoothscroll from 'smoothscroll-polyfill'
import Meta from '../../public/img/Meta'
import Navigation from '../components/Navigation'
import { CreditumDataWrapper } from '../hooks/Creditum/useCreditumData'
import { UseAlertsWrapper } from '../hooks/useAlerts'
import '../styles/global.css'
import getLibrary from '../utils/getLibrary'
import { GeistProvider } from '@geist-ui/react'
import Web3ReactManager from '../components/Web3ReactManager'

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        smoothscroll.polyfill()
    }, [])

    const Web3ReactProviderDefault = dynamic(() => import('../components/Provider'), { ssr: false })

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </Head>
            <Meta />
            <GeistProvider>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <Web3ReactProviderDefault getLibrary={getLibrary}>
                        <Web3ReactManager>
                            <UseAlertsWrapper>
                                <CreditumDataWrapper>
                                    <Navigation />
                                    <Component {...pageProps} />
                                </CreditumDataWrapper>
                            </UseAlertsWrapper>
                        </Web3ReactManager>
                    </Web3ReactProviderDefault>
                </Web3ReactProvider>
            </GeistProvider>
        </>
    )
}
