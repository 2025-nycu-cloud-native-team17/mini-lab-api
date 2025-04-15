import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { UserRole, UserStatus, UserTestType, UserBody } from '../types/mini_lab';
import { MiniLabUserModel, MiniLabMachineModel } from '../models/mini_lab'; // 你定義的 mongoose model


export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Missing user ID in request.' });
    }

    const deletedUser = await MiniLabUserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ message: 'User deleted successfully.', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const handleDeleteMachine = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: 'Missing Machine ID in request.' });
      }
  
      const deletedMachine = await MiniLabMachineModel.findByIdAndDelete(id);
  
      if (!deletedMachine) {
        return res.status(404).json({ message: 'Machine not found.' });
      }
  
      return res.status(200).json({ message: 'Machine deleted successfully.', Machine: deletedMachine });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Server error.' });
    }
  };
