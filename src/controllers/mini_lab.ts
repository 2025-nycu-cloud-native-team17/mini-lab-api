import { Request, Response, NextFunction } from 'express';
import { addUser, deleteUser, updateUser, getUserById, getUsers } from '../services/mini_lab';

export const handleRegisterUser = async (req: Request, res: Response) => {
    try {
        const userBody = req.body;
        const newUser = await addUser(userBody);
        return res.status(201).json(newUser);
    } catch (err: any) {
        return res.status(400).json({ message: err.message || 'Failed to register user' });
    }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Failed to delete user' });
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body; // Partial<UserBody>

        const updatedUser = await updateUser(id, updates);

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
      const users = await getUsers();
      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Failed to get users' });
    }
};

export const handleGetUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (err: any) {
        return res.status(400).json({ message: err.message || 'Failed to get user' });
    }
};