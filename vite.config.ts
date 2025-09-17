import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Set NODE_ENV based on command
  process.env.NODE_ENV = command === 'build' ? 'production' : 'development';
  
  return {
    plugins: [
      react(),
      // Plugin để copy bubble.html từ public
      {
        name: 'copy-bubble',
        generateBundle() {
          // Đọc file bubble.html từ public folder
          const fs = require('fs');
          const path = require('path');
          const bubbleHtmlPath = path.join(__dirname, 'public', 'bubble.html');
          
          try {
            const bubbleContent = fs.readFileSync(bubbleHtmlPath, 'utf-8');
            this.emitFile({
              type: 'asset',
              fileName: 'bubble.html',
              source: bubbleContent
            });
          } catch (error) {
            console.error('Failed to copy bubble.html:', error);
          }
        }
      }
    ],
    base: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': join(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    optimizeDeps: {
      exclude: ['electron'],
    },
  };
});
