import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-flutter-app',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = decodeURIComponent(req.url || '');
          if (url.includes('/edgar ai 2') || url === '/edgar-ai-2/index.html' || url === '/edgar-ai-2') {
            res.writeHead(302, { Location: '/edgar-ai-2/' });
            res.end();
            return;
          }
          if (url === '/quizreward' || url === '/quizreward/index.html') {
            res.writeHead(302, { Location: '/quizreward/' });
            res.end();
            return;
          }
          if (url === '/edgar-ai-2/') {
            const indexPath = path.resolve(__dirname, 'public/edgar-ai-2/index.html');
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(indexPath));
            return;
          }
          if (url === '/quizreward/') {
            const indexPath = path.resolve(__dirname, 'public/quizreward/index.html');
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(indexPath));
            return;
          }
          next();
        });
      }
    }
  ],
})
