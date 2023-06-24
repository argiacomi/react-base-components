import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/lib/utils.js'),
      '@components': path.resolve(__dirname, './src/components'),
      '@component/hooks': path.resolve(__dirname, './src/components/lib/hooks'),
      '@component/utils': path.resolve(__dirname, './src/components/lib/helpers'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@transitions': path.resolve(__dirname, './src/components/utils/transitions')
    }
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-styled-components', 'babel-plugin-macros']
      },
      exclude: /\.stories\.(t|j)sx?$/
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  esbuild: {
    logLevel: 'error'
  }
});
