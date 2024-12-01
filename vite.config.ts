import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
    }),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@headlessui/react',
      'framer-motion',
      'wagmi',
      '@web3modal/wagmi',
    ],
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'web3-vendor': ['wagmi', '@web3modal/wagmi'],
          'ui-vendor': ['@headlessui/react', 'framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
