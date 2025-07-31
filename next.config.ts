import type { NextConfig } from 'next'
import nextra from 'nextra'

const nextConfig: NextConfig = {
}

const withNextra = nextra({
    theme: 'nextra-theme-blog',
    themeConfig: './theme.config.jsx'
})

export default withNextra(nextConfig)
