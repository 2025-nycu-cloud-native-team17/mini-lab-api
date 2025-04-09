import express, { Router } from 'express';
import { authenticateJWT } from '../services/auth';
import jwt from 'jsonwebtoken';
import { appConfig } from '../index';
import * as MiniLabService from '../services/mini_lab';

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

MiniLabRouter.get('/v1/machines', authenticateJWT, async (req, res) => {
  try {
    const machines = await MiniLabService.getMachines();
    return res.status(200).json(machines);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.post('/v1/machines', authenticateJWT, async (req, res) => {
  try {
    const newMachine = await MiniLabService.addMachine(req.body);
    return res.status(201).json(newMachine);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.put('/v1/machines/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedMachine = await MiniLabService.updateMachineById(req.params.id, req.body);
    if (updatedMachine) {
      return res.status(200).json(updatedMachine);
    } else {
      return res.status(404).json({ msg: 'Machine not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.put('/v1/machines/:id/:attribute', authenticateJWT, async (req, res) => {
  try {
    const updatedMachine = await MiniLabService.updateMachineAttributeById(req.params.id, req.params.attribute, req.body.value);
    if (updatedMachine) {
      return res.status(200).json(updatedMachine);
    } else {
      return res.status(404).json({ msg: 'Machine not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.delete('/v1/machines/:id', authenticateJWT, async (req, res) => {
  try {
    const result = await MiniLabService.deleteMachineById(req.params.id);
    if (result) {
      return res.status(200).json({ msg: 'Machine deleted successfully', result });
    } else {
      return res.status(404).json({ msg: 'Machine not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

// 任務相關 routes
MiniLabRouter.get('/v1/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await MiniLabService.getTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.post('/v1/tasks', authenticateJWT, async (req, res) => {
  try {
    const newTask = await MiniLabService.addTask(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.put('/v1/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const updatedTask = await MiniLabService.updateTaskById(req.params.id, req.body);
    if (updatedTask) {
      return res.status(200).json(updatedTask);
    } else {
      return res.status(404).json({ msg: 'Task not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.put('/v1/tasks/:id/:attribute', authenticateJWT, async (req, res) => {
  try {
    const updatedTask = await MiniLabService.updateTaskAttributeById(req.params.id, req.params.attribute, req.body.value);
    if (updatedTask) {
      return res.status(200).json(updatedTask);
    } else {
      return res.status(404).json({ msg: 'Task not found' }); // 錯誤訊息應該是 Task not found
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.delete('/v1/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const result = await MiniLabService.deleteTaskById(req.params.id);
    if (result) {
      return res.status(200).json({ msg: 'Task deleted successfully', result });
    } else {
      return res.status(404).json({ msg: 'Task not found' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});



