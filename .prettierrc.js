module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'ignore',
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  importOrderParserPlugins: [
    'typescript',
    'classProperties',
    'decorators-legacy',
    'jsx'
  ],
  importOrder: ['^@nestjs(.*)', '<THIRD_PARTY_MODULES>', '^[./]']
}
