import type { Config } from 'tailwindcss'

interface ExtendedConfig extends Config {
    daisyui?: {
        themes: string[]
    }
}

export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: { extend: {} },
    daisyui: {
        themes: ['light', 'dark', 'cupcake'],
    },
} satisfies ExtendedConfig
