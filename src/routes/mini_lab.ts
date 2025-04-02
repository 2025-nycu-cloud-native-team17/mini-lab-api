import express, { Router } from 'express';
import { authenticateJWT } from '../services/auth';
import jwt from 'jsonwebtoken';
import { appConfig } from '../index';

export const MiniLabRouter: Router = express.Router();

// debugging routes
MiniLabRouter.get('/v1/test_route', async (req, res) => {
  console.log(appConfig.jwt_secret)
  return res.status(200).json({ msg: 'test_route!' });
});

// 共通 routes
MiniLabRouter.post('/v1/register', async (req, res) => {
  return res.status(200).json({ msg: 'register!' });
});

/*
Test with.
curl -X POST http://localhost:8888/api/v1/login \
-H "Content-Type: application/json" \
-d '{"username": "admin", "password": "password"}'
{"message":"Unauthorized"}
*/
MiniLabRouter.post('/v1/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, appConfig.jwt_secret, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
});

MiniLabRouter.post('/v1/logout', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'logout!' });
});

MiniLabRouter.get('/v1/user', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'user!' });
}); 


// 組長相關 routes
MiniLabRouter.get('/v1/users', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'users!' });
});

MiniLabRouter.post('/v1/users', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'add user!' });
});

MiniLabRouter.put('/v1/users/:id', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update user!' });
});

MiniLabRouter.put('/v1/users/:id/:attribute', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update user!' });
});

MiniLabRouter.delete('/v1/users/:id', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'delete user!' });
});


// 機器相關 routes
MiniLabRouter.get('/v1/machines', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'machines!' });
});

MiniLabRouter.post('/v1/machines', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'add machine!' });
});

MiniLabRouter.put('/v1/machines/:id', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update machine!' });
});

MiniLabRouter.put('/v1/machines/:id/:attribute', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update machine!' });
});

MiniLabRouter.delete('/v1/machines/:id', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'delete machine!' });
});


// 任務相關 routes
MiniLabRouter.get('/v1/tasks', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'tasks!' });
});

MiniLabRouter.post('/v1/tasks', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'add task!' });
});

MiniLabRouter.put('/v1/tasks/:id', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update task!' });
});

MiniLabRouter.put('/v1/tasks/:id/status', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update task status!' });
});

// MiniLabRouter.post('/v1/tasks/:id/warning', authenticateJWT, async (req, res) => {
//   return res.status(200).json({ msg: 'warning task!' });
// });

MiniLabRouter.delete('/v1/tasks/:id', authenticateJWT, async (req, res) => {
  return res.status(200).json({ msg: 'delete task!' });
});



