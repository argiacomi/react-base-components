import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/lib/utils.js'),
      '@component': path.resolve(__dirname, './src/components')
    }
  },
  plugins: [
    react({ exclude: /\.stories\.(t|j)sx?$/ }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
});
