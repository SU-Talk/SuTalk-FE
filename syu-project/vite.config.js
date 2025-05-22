import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    host: 'localhost',
    port: 5173, // 기본값이지만 명시적으로 설정
    strictPort: true, // 포트 충돌 시 대체 포트 안 쓰고 바로 에러

    watch: {
      usePolling: true,     // 변경 감지를 polling으로 (속도 개선에 도움될 수 있음)
      interval: 100,        // 감지 주기 설정
    },

    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  optimizeDeps: {
    include: ['react-spinners'], // 로딩 컴포넌트 미리 번들에 포함
  },
});
