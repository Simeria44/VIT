import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match a static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 12000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  if (PORT === 12000) {
    console.log(`Access via: https://work-1-tjrnksunzsgzcjjb.prod-runtime.all-hands.dev`);
  } else if (PORT === 12001) {
    console.log(`Access via: https://work-2-tjrnksunzsgzcjjb.prod-runtime.all-hands.dev`);
  }
});