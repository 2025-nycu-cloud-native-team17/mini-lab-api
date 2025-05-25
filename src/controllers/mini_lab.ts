import { Request, Response, NextFunction } from 'express';
import * as MiniLabService from '../services/mini_lab';
import { access } from 'fs';
import { console } from 'inspector';
import { logger } from '../utils/logger';

export const handleLogin = async (req: Request, res: Response) => {
  try{
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    if(!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
    }
    const Tokens = await MiniLabService.login(email, password);
    const { accessToken, refreshToken } = Tokens;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: true, // set to true if using https
        // sameSite: 'strict', // set to 'none' if using cross-site cookies
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ accessToken });
  }catch(err: any) {
    console.log(err);
    return res.status(401).json({ message: err.message || 'Login failed' });
  }
}

export const handleLogout = async (req: Request, res: Response) => {
    try{
        const cookies = req.cookies;
        if(!cookies?.refreshToken) return res.sendStatus(204); // No content

        const refreshToken = cookies.refreshToken;
        await MiniLabService.logout(refreshToken); // 交給 service 清掉DB裡的refreshToken
        
        res.clearCookie('refreshToken', { httpOnly: true }); // 清掉 cookie 裡的 refreshToken
        return res.sendStatus(204);
    }catch(err: any) {
        return res.status(401).json({ message: err.message || 'Logout failed' });
    }
}

export const handleRefreshToken = async (req: Request, res: Response) => {
    try {
      const cookie = req.cookies;
      if (!cookie?.refreshToken) {
        return res.status(401).json({ message: 'No refresh token in cookies' });
      }
  
      const refreshToken = cookie.refreshToken;
      const accessToken = await MiniLabService.refreshAccessToken(refreshToken);
      return res.status(200).json({ accessToken });
  
    } catch (err: any) {
      return res.status(403).json({ message: err.message || 'Refresh token invalid' });
    }
  };

export const handleRegisterUser = async (req: Request, res: Response) => {
    try {
        const userBody = req.body;
        const newUser = await MiniLabService.addUser(userBody);
        return res.status(201).json(newUser);
    } catch (err: any) {
        return res.status(400).json({ message: err.message || 'Failed to register user' });
    }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // console.log(id);
    await MiniLabService.deleteUser(id);
    return res.status(204).json({ message: 'User deleted successfully' });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Failed to delete user' });
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Partial<UserBody>
        
        // 檢查修改目標和發出請求的人是否為同一人
        // manager有權限改所有user資料
        console.log(req.user);
        if(req.user?.id !== id && req.user?.role !== 'manager') {
            return res.status(403).json({ message: 'You can only modify your own profile' });
        }

        const updatedUser = await MiniLabService.updateUser(id, updates);

        if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser);
    } catch (err: any) {
        return res.status(400).json({ message: err.message || 'Failed to update user' });
    }
};

export const handleGetUser = async (req: Request & { user?: { id: string } }, res: Response) => {
  try {
    // const id: string|undefined = req.user?.id;
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await MiniLabService.getUserById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found(from handle get user)' });
    }

    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Failed to get users' });
  }
};

export const handleGetUsers = async (req: Request, res: Response) => {
    try {
      const users = await MiniLabService.getUsers();
      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Failed to get users' });
    }
};

export const handleGetUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await MiniLabService.getUserById(id);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (err: any) {
        return res.status(400).json({ message: err.message || 'Failed to get user' });
    }
};

export const handleGetMachines = async (req: Request, res: Response) => {
  try {
    const machines = await MiniLabService.getMachines();
    return res.status(200).json(machines);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
};

export const handleAddMachine = async (req: Request, res: Response) => {
  try {
    const newMachine = await MiniLabService.addMachine(req.body);
    return res.status(201).json(newMachine);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
};

export const handleUpdateMachineById = async (req: Request, res: Response) => {
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
}


export const handleUpdateMachineAttributeById = async (req: Request, res: Response) => {
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
};

export const handleDeleteMachineById =  async (req: Request, res: Response) => {
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
};

// task 相關 routes
export const handleGetTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await MiniLabService.getTasks();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
};

export const handleAddTask = async (req: Request, res: Response) => {
  try {
    const newTask = await MiniLabService.addTask(req.body);
    return res.status(201).json(newTask);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
};

export const handleUpdateTaskById = async (req: Request, res: Response) => {
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
};

export const handleUpdateTaskAttributeById = async (req: Request, res: Response) => {
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
};

export const handleDeleteTaskById = async (req: Request, res: Response) => {
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
};

export const handleScheduleTask = async (req: Request, res: Response) => {
  try {
    const result = await MiniLabService.requestScheduler();
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
};

export const handleGetAssignments = async (req: Request, res: Response) => {
  try {
    const result = await MiniLabService.getAssignments();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error });
  }
};

