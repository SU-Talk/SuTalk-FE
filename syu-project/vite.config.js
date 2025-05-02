import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot 백엔드 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // 혹시 prefix 제거할 거면 이걸 수정
      },
    },
  },
});
