import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../index';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).json({ message: 'no accessToken in Header' });
    
    const accessToken = authHeader.split(' ')[1];
    jwt.verify(
        accessToken, 
        appConfig.access_token_secret, 
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid accessToken' });
            req.user = decoded as { id: string, email: string; role: string}; // user寫回req物件，這樣就透過token取得user資訊了
            next();
        }
    ); 
}