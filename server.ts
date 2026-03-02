import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ projects: [], theme: null }));
}

const getData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const saveData = (data: any) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

app.use(express.json());

app.get('/api/projects', (req, res) => {
  const data = getData();
  res.json(data.projects);
});

app.post('/api/projects', (req, res) => {
  const data = getData();
  data.projects.push(req.body);
  saveData(data);
  res.json({ success: true });
});

app.put('/api/projects/:id', (req, res) => {
  const data = getData();
  data.projects = data.projects.map((p: any) => p.id === req.params.id ? req.body : p);
  saveData(data);
  res.json({ success: true });
});

app.delete('/api/projects/:id', (req, res) => {
  const data = getData();
  data.projects = data.projects.filter((p: any) => p.id !== req.params.id);
  saveData(data);
  res.json({ success: true });
});

app.get('/api/theme', (req, res) => {
  const data = getData();
  res.json(data.theme);
});

app.post('/api/theme', (req, res) => {
  const data = getData();
  data.theme = req.body;
  saveData(data);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
