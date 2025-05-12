import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { //모든 /api로 시작하는 요청을 백엔드로 전달
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true
      }
    }
  }
})
