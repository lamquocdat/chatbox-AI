import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

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
                    const bubbleHtmlPath = join(__dirname, 'public', 'bubble.html');

                    try {
                        const bubbleContent = readFileSync(bubbleHtmlPath, 'utf-8');
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
            proxy: {
                '/api': {
                    target: 'http://104.43.56.62:3000',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path,
                }
            }
        },
        optimizeDeps: {
            exclude: ['electron'],
        },
    };
});
