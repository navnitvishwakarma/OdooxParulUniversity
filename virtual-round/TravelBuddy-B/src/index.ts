import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const parsedPort = parseInt(PORT as string, 10);

const server = app.listen(parsedPort, () => {
  console.log(`Server is running on port ${parsedPort}`);
});

server.on('error', (error) => {
  console.error('Server failed to start:', error);
});
