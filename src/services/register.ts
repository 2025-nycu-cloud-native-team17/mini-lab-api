import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { UserRole, UserStatus, UserTestType, UserBody } from '../types/mini_lab';
import { MiniLabUserModel } from '../models/mini_lab'; // 你定義的 mongoose model


export const handleRegisterUser = async (req: Request, res: Response) => {
    try {
        const userBody: Partial<UserBody> = req.body;

        // Validate request body
        if (!userBody.email || !userBody.password || !userBody.name) {
            return res.status(400).json({ message: 'Email, password, and name are required' });
        }

        if (!Object.values(UserRole).includes(userBody.role as UserRole)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        
        if (!Object.values(UserTestType).includes(userBody.testType as UserTestType)) {
        return res.status(400).json({ message: 'Invalid test type' });
        }
        
        if (!Object.values(UserStatus).includes(userBody.status as UserStatus)) {
        return res.status(400).json({ message: 'Invalid status' });
        }

        // Check if user already exists
        const existingUser = await MiniLabUserModel.findOne({ email: userBody.email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // 先不對密碼加密，直接存進資料庫。因為這樣比較方便開發
        // Hash the password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(userBody.password, salt);

        // Create new user
        const newUser = new MiniLabUserModel({
            email: userBody.email,
            // password: hashedPassword,
            password: userBody.password,
            name: userBody.name,
            role: userBody.role,
            testType: userBody.testType,
            status: userBody.status,
        });
          
        // Save user to database
        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const handleRegisterMachine = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};