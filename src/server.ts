import express, { Express } from 'express';
import cors from 'cors';
import { AppConfig } from './types/config';
import { establishConnection } from './plugins/mongodb';
import { TodoRouter } from './routes/todo';
import { MiniLabRouter } from './routes/mini_lab';
import cookieParser from 'cookie-parser';
export const serverOf: () => Express = () => {
  const app = express();
  
   // cors settings
  app.use(cors({
    origin: 'http://localhost:3000', // 允許前端來源
    credentials: true                // 允許攜帶 cookies
  }));

  // Middleware for parsing JSON
  app.use(express.json());
  app.use(cookieParser());

  // Simple ping route
  app.get('/ping', async (req, res) => {
    return res.status(200).json({ msg: 'pong!' });
  });

  // Register todo routes
  app.use('/api', TodoRouter);
  app.use('/api', MiniLabRouter);

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