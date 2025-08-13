import { useMDXComponents as getNextraComponents } from 'nextra/mdx-components'

const defaultComponents = getNextraComponents()

export function useMDXComponents(components) {
    return {
        ...defaultComponents,
        ...components
    }
}