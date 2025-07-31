import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
}

// @ts-ignore
const withNextra = require('nextra')({
    theme: 'nextra-theme-blog',
    themeConfig: './theme.config.jsx'
})

export default withNextra(nextConfig)
