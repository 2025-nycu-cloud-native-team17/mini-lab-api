import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../index';
import * as MiniLabService from '../services/mini_lab';
import { verifyJWT } from '../middleware/verifyJWT';
import { handleLogin } from '../services/auth';
import { handleRefreshToken } from '../services/refreshToken';


export const MiniLabRouter: Router = express.Router();

// debugging routes
MiniLabRouter.get('/v1/test_route', async (req, res) => {
  // console.log(appConfig.access_token_secret)
  return res.status(200).json({ msg: 'route work successfully!' });
});

MiniLabRouter.get('/v1/test_verifyJWT', verifyJWT, async (req, res) => {
  // console.log(appConfig.access_token_secret)
  return res.status(200).json({ msg: 'verifyJWT successfully!' });
});

//不一定實作
MiniLabRouter.post('/v1/register', async (req, res) => {
  return res.status(200).json({ msg: 'register!' });
});

MiniLabRouter.post('/v1/login', handleLogin);

MiniLabRouter.get('/v1/refresh', handleRefreshToken);

MiniLabRouter.post('/v1/logout', async (req, res) => {
  return res.status(200).json({ msg: 'logout!' });
});

MiniLabRouter.get('/v1/user', verifyJWT, async (req, res) => {
  return res.status(200).json({ msg: 'user!' });
}); 


// 組長相關 routes
MiniLabRouter.get('/v1/users', verifyJWT, async (req, res) => {
  return res.status(200).json({ msg: 'users!' });
});

MiniLabRouter.post('/v1/users', verifyJWT, async (req, res) => {
  return res.status(200).json({ msg: 'add user!' });
});

MiniLabRouter.put('/v1/users/:id', verifyJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update user!' });
});

MiniLabRouter.put('/v1/users/:id/:attribute', verifyJWT, async (req, res) => {
  return res.status(200).json({ msg: 'update user!' });
});

MiniLabRouter.delete('/v1/users/:id', verifyJWT, async (req, res) => {
  return res.status(200).json({ msg: 'delete user!' });
});

MiniLabRouter.get('/v1/machines', verifyJWT, async (req, res) => {
  try {
    const machines = await MiniLabService.getMachines();
    return res.status(200).json(machines);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.post('/v1/machines', verifyJWT, async (req, res) => {
  try {
    const newMachine = await MiniLabService.addMachine(req.body);
    return res.status(201).json(newMachine);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.put('/v1/machines/:id', verifyJWT, async (req, res) => {
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

MiniLabRouter.put('/v1/machines/:id/:attribute', verifyJWT, async (req, res) => {
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

MiniLabRouter.delete('/v1/machines/:id', verifyJWT, async (req, res) => {
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
MiniLabRouter.get('/v1/tasks', verifyJWT, async (req, res) => {
  try {
    const tasks = await MiniLabService.getTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.post('/v1/tasks', verifyJWT, async (req, res) => {
  try {
    const newTask = await MiniLabService.addTask(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
});

MiniLabRouter.put('/v1/tasks/:id', verifyJWT, async (req, res) => {
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

MiniLabRouter.put('/v1/tasks/:id/:attribute', verifyJWT, async (req, res) => {
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

MiniLabRouter.delete('/v1/tasks/:id', verifyJWT, async (req, res) => {
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



