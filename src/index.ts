import * as dotenv from 'dotenv';
import { AppConfig } from './types/config';
import { serverOf, serverStart } from './server';

dotenv.config();

const app = serverOf();

const appConfig: AppConfig = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING || ''
};

serverStart(appConfig)(app)
  .then(() => {
    console.log(`Server listening on ${appConfig.host}:${appConfig.port}`);
  })
  .catch((err) => {
    console.error(err);
  });