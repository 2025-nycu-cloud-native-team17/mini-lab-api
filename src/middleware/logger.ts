import { logger } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';
import os from 'os'; 

export const routeLogger = (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info({
        whom:  'mini-lab-' + os.hostname(),
        method: req.method,
        route:  req.route?.path,
        url:    req.url,
        headers:req.headers,
        body:   req.body,
        params: req.params,
        query:  req.query
      }, '☑️ incoming request');
    } catch (err) {
      // 若 JSON 化或 logger 本身發生錯誤，仍要繼續下個 middleware
      logger.error({
        error: err instanceof Error ? err.stack : err,
        route: req.route?.path,
        url:   req.url
      }, '✖️ routeLogger failed');
    }
    next();
}