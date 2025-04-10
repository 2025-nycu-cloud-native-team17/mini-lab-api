import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { appConfig } from '../index';
import { findUserByEmail,  } from '../repo/mini_lab';
import bcrypt from 'bcrypt';

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  if(!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const foundUser = await findUserByEmail(email);
  console.log(foundUser);
  if(!foundUser) {
    return res.status(401).json({ message: 'Not found this account' });
  }
  // const match = await bcrypt.compare(password, foundUser.password);
  const match = password === foundUser.password;
  if(match) {
    // create accessToken and refreshToken
    const accessToken = jwt.sign(
      { email: foundUser.email},
      appConfig.access_token_secret,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email},
      appConfig.refresh_token_secret,
      { expiresIn: '1d' }
    );

    // save refreshToken to db
    await foundUser.updateOne({ refreshToken: refreshToken });

    // set refreshToken to cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      // secure: true, // set to true if using https
      // sameSite: 'strict', // set to 'none' if using cross-site cookies
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ accessToken });
  }
  else{
      res.status(401).json({ message: 'Invalid credentials' });
  }
}