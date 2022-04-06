module.exports = {
    async redirects() {
        return [
            {
                source: '/twitter',
                destination: 'https://twitter.com/RevenantLabs',
                permanent: true
            },
            {
                source: '/discord',
                destination: 'https://discord.gg/aDmKM7E7SY',
                permanent: true
            },
            {
                source: '/github',
                destination: 'https://revenant-labs.medium.com/',
                permanent: true
            },
            {
                source: '/medium',
                destination: 'https://revenant-labs.medium.com/',
                permanent: true
            },
            {
                source: '/docs',
                destination: 'https://docs.revenantlabs.io/stak/',
                permanent: true
            }
        ]
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        })

        return config
    }
}
