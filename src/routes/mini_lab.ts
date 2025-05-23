import express, { Router } from 'express';
// import jwt from 'jsonwebtoken';
// import { appConfig } from '../index';
// import * as MiniLabService from '../services/mini_lab';
import * as MiniLabController from '../controllers/mini_lab';
import { verifyJWT } from '../middleware/verifyJWT';
import { requireManagerRole } from '../middleware/requireRole';
import { routeLogger } from '../middleware/logger';

export const MiniLabRouter: Router = express.Router();

// debugging routes
MiniLabRouter.get('/v1/test_route', routeLogger, async (req, res) => {
  return res.status(200).json({ msg: 'route work successfully!' });
});

MiniLabRouter.get('/v1/test_verifyJWT', routeLogger, verifyJWT, async (req, res) => {
  return res.status(200).json({ msg: 'verifyJWT successfully!' });
});

// employee 相關 routes
MiniLabRouter.get('/v1/user', routeLogger, verifyJWT, MiniLabController.handleGetUser)
MiniLabRouter.get('/v1/users', routeLogger, verifyJWT, requireManagerRole, MiniLabController.handleGetUsers)
MiniLabRouter.get('/v1/user/:id', routeLogger, verifyJWT, MiniLabController.handleGetUserById);
MiniLabRouter.post('/v1/user', routeLogger, verifyJWT, requireManagerRole, MiniLabController.handleRegisterUser);
MiniLabRouter.delete('/v1/user/:id', routeLogger, verifyJWT, requireManagerRole, MiniLabController.handleDeleteUser);
MiniLabRouter.put('/v1/user/:id', routeLogger, verifyJWT, MiniLabController.handleUpdateUser);

MiniLabRouter.post('/v1/login', routeLogger, MiniLabController.handleLogin);
MiniLabRouter.get('/v1/logout', routeLogger, MiniLabController.handleLogout);
MiniLabRouter.get('/v1/refresh', routeLogger, MiniLabController.handleRefreshToken);

MiniLabRouter.get('/v1/machines', routeLogger, verifyJWT, MiniLabController.handleGetMachines);
MiniLabRouter.post('/v1/machines', routeLogger, verifyJWT, MiniLabController.handleAddMachine);
MiniLabRouter.put('/v1/machines/:id', routeLogger, verifyJWT, MiniLabController.handleUpdateMachineById);
MiniLabRouter.put('/v1/machines/:id/:attribute', routeLogger, verifyJWT, MiniLabController.handleUpdateMachineAttributeById);
MiniLabRouter.delete('/v1/machines/:id', routeLogger, verifyJWT, MiniLabController.handleDeleteMachineById);

MiniLabRouter.get('/v1/tasks', routeLogger, verifyJWT, MiniLabController.handleGetTasks);
MiniLabRouter.post('/v1/tasks', routeLogger, verifyJWT, MiniLabController.handleAddTask);
MiniLabRouter.put('/v1/tasks/:id', routeLogger, verifyJWT, MiniLabController.handleUpdateTaskById);
MiniLabRouter.put('/v1/tasks/:id/:attribute', routeLogger, verifyJWT, MiniLabController.handleUpdateTaskAttributeById);
MiniLabRouter.delete('/v1/tasks/:id', routeLogger, verifyJWT, MiniLabController.handleDeleteTaskById);

// MiniLabRouter.post('/v1/tasks/schedule', routeLogger, verifyJWT, MiniLabController.handleScheduleTask);
