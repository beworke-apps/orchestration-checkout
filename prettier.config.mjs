/** @type {import('prettier').Config} */
const config = {
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: ['^react$', '^next(.*)$', '^@heroui(.*)$', '^@heroui-pro(.*)$', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
