import * as dotenv from 'dotenv';
import { AppConfig } from './types/config';
import { serverOf, serverStart } from './server';

dotenv.config();

export const appConfig: AppConfig = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING || '',
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || '',
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || '',
};

if (require.main === module) {
  const app = serverOf();

  serverStart(appConfig)(app)
    .then(() => {
      console.log(`Server listening on ${appConfig.host}:${appConfig.port}`);
    })
    .catch((err) => {
      console.error(err);
    });
  }