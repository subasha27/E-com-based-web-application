import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const secretKey = process.env.SecretKeyForUser as string;



function userToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export default userToken;   