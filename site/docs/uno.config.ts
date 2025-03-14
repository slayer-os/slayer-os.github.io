import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

type _FirstArgument<T> = T extends (arg: infer A, ...args: any[]) => any ? A : never;
type _AllArguments<T> = T extends (arg: infer A, ...args: infer B) => any ? [A, ...B] : never;

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
    }
  })
})
