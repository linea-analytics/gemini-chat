import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running at PORT:${PORT}`);
});
