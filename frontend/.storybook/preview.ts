import type { Preview } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import '../src/styles/main.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [withRouter]
}

export default preview
