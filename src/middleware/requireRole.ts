import { Request, Response, NextFunction } from 'express';

export const requireManagerRole = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'manager' && req.user?.role !== 'leader') {
      return res.status(403).json({ message: 'Only managers or leaders can perform this action' });
    }
    next();
  };
  