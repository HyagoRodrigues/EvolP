import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Tratamento de erros
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});