import type { StorybookConfig } from '@storybook/react-vite'
import svgr from 'vite-plugin-svgr'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    return mergeConfig(config, {
      plugins: [svgr()],
    })
  },
}

export default config
