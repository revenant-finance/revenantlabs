import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { UseWalletProvider } from 'use-wallet'
import Meta from '../../public/img/Meta'
import Navigation from '../components/Navigation'
import '../styles/global.css'
import smoothscroll from 'smoothscroll-polyfill'
import { CreditumDataWrapper } from '../hooks/Creditum/useCreditumData'

export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        smoothscroll.polyfill()
    }, [])

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                    integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </Head>
            <Meta />
            <UseWalletProvider>
                <CreditumDataWrapper>
                    <Navigation />
                    <Component {...pageProps} />
                </CreditumDataWrapper>
            </UseWalletProvider>
        </>
    )
}
