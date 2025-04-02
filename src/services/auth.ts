import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../index';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, appConfig.jwt_secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // 將解碼後的 user 資訊附加到 req 物件
      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};