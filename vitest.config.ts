import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/data/**',
        '**/index.ts',
        '**/*.types.ts',
        '**/*.type.ts',
        'src/store/services/**/types.ts',
        'src/store/services/**/dto.ts',
        'src/store/services/**/errors.ts',
        'src/store/services/types/pagination.ts',
        'src/app/**',
        'src/providers/**',
        'src/config/**',
        'src/lib/dayjs.ts',
        'src/store/services/**/*.api.ts',
        'src/store/root-reducer.ts',
        'src/proxy.ts',
        'src/store/services/api/base-api.ts',
        'src/store/services/api/base-query.ts',
        'src/store/services/realtime/**',
        'src/components/templates/app/**',
        'src/hooks/redux/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@/components': path.resolve(dirname, './src/components'),
      '@/widgets': path.resolve(dirname, './src/components/widgets'),
      '@/templates': path.resolve(dirname, './src/components/templates'),
      '@/pages': path.resolve(dirname, './src/components/pages'),
      '@/hooks': path.resolve(dirname, './src/hooks'),
      '@/services': path.resolve(dirname, './src/services'),
      '@/server': path.resolve(dirname, './src/server'),
      '@/lib': path.resolve(dirname, './src/libs'),
      '@/utils': path.resolve(dirname, './src/utils'),
      '@/types': path.resolve(dirname, './src/types'),
      '@/config': path.resolve(dirname, './src/config'),
    },
  },
});
