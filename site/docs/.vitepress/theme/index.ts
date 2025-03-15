import type { App } from 'vue'
import DefaultTheme from 'vitepress/theme'
import 'uno.css'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ _app }: { _app: App }) {
  },
}
