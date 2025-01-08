import express from 'express';
import cors from 'cors';
import { router } from './api';

const app = express();
const port = process.env.PORT || 3000;

// Настраиваем CORS для домена Netlify
app.use(cors({
  origin: ['https://bespoke-bavarois-8deceb.netlify.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});