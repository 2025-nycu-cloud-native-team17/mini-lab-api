import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';
import os from 'os'; 

export const routeLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.info({
        whom: 'mini-lab-' + os.hostname(),
        method: req.method,
        route: req.route.path,
        url: req.url,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query
    }, '☑️ incoming request')
    next();
}