import { Web3ReactProvider } from '@web3-react/core'
import dayjs from 'dayjs'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import smoothscroll from 'smoothscroll-polyfill'
import Meta from '../../public/img/Meta'
import Navigation from '../components/Navigation'
import Web3ReactManager from '../components/Web3ReactManager'
import { CreditumDataWrapper } from '../hooks/Creditum/useCreditumData'
import { UseAlertsWrapper } from '../hooks/useAlerts'
import '../styles/global.css'
import getLibrary from '../utils/getLibrary'

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const Web3ReactProviderDefault = dynamic(() => import('../components/Provider'), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        smoothscroll.polyfill()
    }, [])

    return (
        <>
            <Meta />
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
        </>
    )
}
