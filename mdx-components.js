import { useMDXComponents as useBlogMDXComponents } from 'nextra-theme-blog'

export function useMDXComponents(components) {
    return {
        ...useBlogMDXComponents(),
        ...components
    }
}