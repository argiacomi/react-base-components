import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({ exclude: /\.stories\.(t|j)sx?$/ }),
		legacy({
			targets: ['defaults', 'not IE 11']
		})
	]
});
