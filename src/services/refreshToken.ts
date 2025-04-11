import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../index';
import { findUserByEmail, findUserByToken} from '../repo/mini_lab';
import bcrypt from 'bcrypt';

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if(!cookie || !cookie.refreshToken) {
    return res.status(401).json({ message: 'No refresh token in cookies' });
  }
  const refreshToken = cookie.jwt;
  console.log('refreshToken:', refreshToken);
  const foundUser = await findUserByToken(refreshToken);
  if(!foundUser) {
    return res.status(403).json({ message: 'Not found this jwt!' });
  }
  jwt.verify(
    refreshToken,
    appConfig.refresh_token_secret,
    (err, decoded) => {
      if(err || foundUser.email !== decoded.email) {
        return res.status(403).json({ message: 'jwt is incorrect!' });
      }
      const accessToken = jwt.sign(
        { email: decoded.email },
        appConfig.access_token_secret,
        { expiresIn: '30s' }
      );
      res.json({ accessToken });
    }
  );
}