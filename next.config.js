module.exports = {
    async redirects() {
        return [
            {
                source: '/twitter',
                destination: 'https://twitter.com/RevenantFinance',
                permanent: true
            },
            {
                source: '/discord',
                destination: 'https://discord.gg/aDmKM7E7SY',
                permanent: true
            },
            {
                source: '/github',
                destination: 'https://github.com/revenant-finance',
                permanent: true
            }
        ]
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    }
}
