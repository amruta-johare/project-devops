// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy API calls to Spring Boot to avoid CORS in dev
    proxy: {
      '/auth': 'http://localhost:8080',
      '/pg': 'http://localhost:8080',
      '/applications': 'http://localhost:8080',
      '/tenants': 'http://localhost:8080',
    }
  }
})
