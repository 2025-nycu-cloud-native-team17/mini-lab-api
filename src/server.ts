import express, { Express } from 'express';
import { AppConfig } from './types/config';
import { establishConnection } from './plugins/mongodb';
import { TodoRouter } from './routes/todo';

export const serverOf: () => Express = () => {
  const app = express();
  
  // Middleware for parsing JSON
  app.use(express.json());

  // Simple ping route
  app.get('/ping', async (req, res) => {
    return res.status(200).json({ msg: 'pong!' });
  });

  // Register todo routes
  app.use('/api', TodoRouter);

  return app;
};

export const serverStart: (appConfig: AppConfig) => (app: Express) => Promise<Express> =
  (appConfig) => async (app) => {
    await establishConnection(appConfig.mongoConnectionString);
    
    return new Promise((resolve) => {
      app.listen(appConfig.port, appConfig.host, () => {
        resolve(app);
      });
    });
  };