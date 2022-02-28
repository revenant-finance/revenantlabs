import Head from 'next/head'

const Meta = () => {
    const title = 'Revenant Labs'
    const description = "DeFi builders on the world's fastest blockchain."
    const url = 'https://revenantlabs.vercel.app'

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="og:title" property="og:title" content={title} />
            <meta name="og:description" property="og:description" content={description} />
            <meta property="og:site_name" content={title} />
            <meta property="og:url" content={url} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:site" content={url} />
            <link rel="icon" type="image/png" href={`${url}/img/revenant-coin.png`} />
            <meta property="og:image" content={`${url}/img/revenant-coin.png`} />
            <meta name="twitter:image" content={`${url}/img/revenant-coin.png`} />
        </Head>
    )
}

export default Meta
