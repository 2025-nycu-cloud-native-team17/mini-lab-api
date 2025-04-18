export type AppConfig = {
  port: number
  host: string
  mongoConnectionString: string
  access_token_secret: string
  refresh_token_secret: string
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}