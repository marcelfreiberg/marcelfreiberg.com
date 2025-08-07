import type { NextConfig } from 'next'
import nextra from 'nextra'

const nextConfig: NextConfig = {
}

const withNextra = nextra({
    search: false,
    latex: true
})

export default withNextra(nextConfig)
