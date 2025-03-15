import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

type _FirstArgument<T> = T extends (arg: infer A, ...args: any[]) => any ? A : never
type _AllArguments<T> = T extends (arg: infer A, ...args: infer B) => any ? [A, ...B] : never

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      unit: 'em',
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  content: {
    pipeline: {
      include: ['./**/*.vue', './**/*.md'],
    },
  },
  extendTheme: (theme: _FirstArgument<Parameters<typeof defineConfig>[0]['extendTheme']>) => ({
    ...theme,
    colors: {
      ...theme,
      'pale-azure': '#97dffc',
      'tropical-indigo': '#858ae3',
      'iris': '#613dc1',
      'indigo': '#4e148c',
      'russian-violet': '#2c0735',
      // Map these colors to CSS variables used in VitePress
      'vp-c-brand-light': '#858ae3', // tropical-indigo
      'vp-c-brand': '#613dc1', // iris
      'vp-c-brand-dark': '#4e148c', // indigo
    },
  }),
})
