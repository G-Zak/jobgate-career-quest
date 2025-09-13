import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@app': resolve(__dirname, 'src/app'),
      '@features': resolve(__dirname, 'src/features'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@config': resolve(__dirname, 'src/config'),
      '@components': resolve(__dirname, 'src/components'),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true, // 👈 required in Docker
    },
    hmr: {
      clientPort: 3000, // 👈 this allows hot reload to work correctly from outside the container
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Only create a separate chunk for Phaser if it actually exists in the graph
        manualChunks(id) {
          if (id && id.includes('node_modules/phaser')) {
            return 'phaser';
          }
        }
      }
    }
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.jsonl']
})
