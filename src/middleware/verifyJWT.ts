import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../index';

export const verifyJWT = (req: Request, res: Response, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    
    const accessToken = authHeader.split(' ')[1];
    jwt.verify(
        accessToken, 
        appConfig.access_token_secret, 
        (err, email) => {
            if (err) return res.status(403).json({ message: 'Invalid accessToken' });
            req.email = email; // user寫回req物件，這樣就透過token取得user資訊了
            next();
        }
    ); 
}