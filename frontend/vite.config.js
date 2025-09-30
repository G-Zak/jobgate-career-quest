import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react({
    // Enable fast refresh but with more conservative settings
    fastRefresh: true,
    // Exclude problematic files from fast refresh
    exclude: [/node_modules/, /\.stories\.(t|j)sx?$/, /\.test\.(t|j)sx?$/]
  })],
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
      usePolling: false, // disabled to prevent excessive polling and auto-refresh
      interval: 2000, // check for changes every 2 seconds - balanced approach
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'], // ignore common directories
    },
    // HMR can cause development auto-refresh issues in some environments.
    // Respect VITE_ENABLE_HMR env var (set to 'true' to re-enable) otherwise disable HMR.
    hmr: process.env.VITE_ENABLE_HMR === 'true' ? {
      clientPort: 3000,
      overlay: false,
      timeout: 60000,
    } : false
  },
  build: {
    rollupOptions: {
      // Explicitly specify application entry points so Vite can determine
      // the correct inputs for Rollup and dependency pre-bundling.
      input: {
        // Primary HTML entry
        index: resolve(__dirname, 'index.html'),
        // App entry (also helpful for some tooling to find the JSX entry)
        main: resolve(__dirname, 'src/app/main.jsx')
      },
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
  // Help Vite pre-bundle core deps to avoid auto-detection warnings
  optimizeDeps: {
    include: [
      // Core React deps
      'react',
      'react-dom',
      'react-router-dom',

      // State + utilities
      'zustand',
      'prop-types',

      // UI libraries
      '@emotion/react',
      '@emotion/styled',
      '@heroicons/react',
      '@mui/material',
      '@mui/icons-material',
      'react-icons',

      // Editors / charts / animations
      'monaco-editor',
      '@monaco-editor/react',
      'chart.js',
      'react-chartjs-2',
      'framer-motion',

      // HTTP client and misc
      'axios',
      'lucide-react'
    ]
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp', '**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.jsonl']
})
