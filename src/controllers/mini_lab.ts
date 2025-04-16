import { Request, Response, NextFunction } from 'express';
import * as MiniLabService from '../services/mini_lab';

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
    await MiniLabService.deleteUser(id);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Failed to delete user' });
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Partial<UserBody>

        const updatedUser = await MiniLabService.updateUser(id, updates);

        if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(updatedUser);
    } catch (err: any) {
        return res.status(400).json({ message: err.message || 'Failed to update user' });
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

