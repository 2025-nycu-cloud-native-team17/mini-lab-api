import { Request, Response, NextFunction } from 'express';

export const requireManagerRole = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can perform this action' });
    }
    next();
  };
  