import { ModifyResult } from 'mongoose'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as repo from '../repo/mini_lab'
import { User, UserBody, Machine, MachineBody, Task, TaskBody } from '../types/mini_lab'
import { UserRole, UserTestType, UserStatus } from '../types/mini_lab'
import { appConfig } from '../index';


export const getMachines: () => Promise<Array<Machine>> = async () => {
  const machines = await repo.findAllMachines()
  return machines
}

export const addMachine: (machineBody: MachineBody) => Promise<Machine> = async (machineBody) => {
  const newMachine = await repo.createMachine(machineBody)
  return newMachine
}

export const updateMachineById: (id: string, update: Partial<MachineBody>) => Promise<Machine | null> = async (id, update) => {
  const machine = await repo.updateMachineById(id, update)
  return machine
}

export const updateMachineAttributeById: (id: string, attribute: string, value: any) => Promise<Machine | null> = async (id, attribute, value) => {
  const machine = await repo.updateMachineById(id, { [attribute]: value })
  return machine
}

export const deleteMachineById: (id: string) => Promise<ModifyResult<Machine>> = async (id) => {
  const result = await repo.deleteMachineById(id)
  return result
}

export const getTasks: () => Promise<Array<Task>> = async () => {
  const tasks = await repo.findAllTasks()
  return tasks
}

export const addTask: (taskBody: TaskBody) => Promise<Task> = async (taskBody) => {
  const newTask = await repo.createTask(taskBody)
  return newTask
}

export const updateTaskById: (id: string, update: Partial<TaskBody>) => Promise<Task | null> = async (id, update) => {
  const task = await repo.updateTaskById(id, update)
  return task
}

export const updateTaskAttributeById: (id: string, attribute: string, value: any) => Promise<Task | null> = async (id, attribute, value) => {
  const task = await repo.updateTaskById(id, {[attribute]: value})
  return task
}

export const deleteTaskById: (id: string) => Promise<ModifyResult<Task>> = async (id) => {
  const result = await repo.deleteTaskById(id)
  return result
}

// export const scheduleTask: (id: string) => Promise<ModifyResult<Task>> = async (id) => {
//   const result = await repo.scheduleTask(id)
//   return result
// }
//-----------------------User---------------------- //
type Token = {
  accessToken: string;
  refreshToken: string;
};
export const login: (email: string, password: string) => Promise<Token> = async (email, password) => {
  const foundUser = await repo.findUserByEmail(email);
  // console.log(foundUser);
  if(!foundUser) {
    throw new Error('Login failed, User not found');
  }

  // 因為DB裡保存的password都有加密過，比對前要先解密
  // const match = await bcrypt.compare(password, foundUser.password);
  
  const match = password === foundUser.password;
  if(!match) {
    throw new Error('Login failed, Invalid password');
  }
  // create accessToken and refreshToken
  const accessToken = jwt.sign(
    { id: foundUser.id.toString(),
      email: foundUser.email,
      role: foundUser.role }, appConfig.access_token_secret,{ expiresIn: '1h' });
  
  const refreshToken = jwt.sign(
    { id: foundUser.id.toString(),
      email: foundUser.email,
      role: foundUser.role }, appConfig.refresh_token_secret, { expiresIn: '1d' });

  // save refreshToken to db
  await foundUser.updateOne({ refreshToken: refreshToken });

  return {accessToken, refreshToken};
}

export const logout: (refreshToken: string) => Promise<void> = async (refreshToken) => {
  // is refreshToken in db?
  const foundUser = await repo.findUserByToken(refreshToken);
  
  if(!foundUser) {
    return;
  }

  // delete refreshToken in db
  await foundUser.updateOne({ refreshToken: '' });
}

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const foundUser = await repo.findUserByToken(refreshToken);
  console.log(refreshToken)
  console.log(foundUser)
  if (!foundUser) {
    throw new Error('Refresh token not found');
  }
  return new Promise<string>((resolve, reject) => {
    jwt.verify(
      refreshToken,
      appConfig.refresh_token_secret,
      (err, decoded) => {
        if (err || typeof decoded !== 'object' || foundUser.email !== decoded.email) {
          return reject(new Error('Refresh token verification failed'));
        }

        const accessToken = jwt.sign(
          { id: foundUser.id.toString(), 
            email: foundUser.email, 
            role: foundUser.role }, appConfig.access_token_secret, { expiresIn: '1h' });
        
        resolve(accessToken);
      }
    );
  });
};

// export const getUser = async (): Promise<User[]> => {
//   const docs = await repo.findAllUsers();

//   return docs.map(doc => {
//     const { _id, password, email, role, status, refreshToken, ...rest } = doc.toObject();
//     return {
//       id: _id.toString(),
//       ...rest,
//     };
//   });
// };

export const getUsers = async (): Promise<User[]> => {
  const docs = await repo.findAllUsers();

  return docs.map(doc => {
    const { _id, password, email, role, status, refreshToken, ...rest } = doc.toObject();
    return {
      id: _id.toString(),
      ...rest,
    };
  });
};

export const getUserById = async (id: string): Promise<User | null> => {
  const doc = await repo.findUserById(id);
  if (!doc) return null;

  const { _id, password, refreshToken, ...rest } = doc.toObject();
  return {
    id: _id.toString(),
    ...rest
  };
};

export const addUser: (userBody: UserBody) => Promise<User> = async (userBody) => {
    // Validate request body
    if (!userBody.email || !userBody.password || !userBody.name) {
      throw new Error('Email, password, and name are required');
    }
  
    if (!Object.values(UserRole).includes(userBody.role as UserRole)) {
      throw new Error('Invalid role');
    }
  
    if (!Object.values(UserTestType).includes(userBody.testType as UserTestType)) {
      throw new Error('Invalid test type');
    }
  
    if (!Object.values(UserStatus).includes(userBody.status as UserStatus)) {
      throw new Error('Invalid status');
    }

    // Check if user already exists
    const existingUser = await repo.findUserByEmail(userBody.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // 先不對密碼加密，直接存進資料庫。因為這樣比較方便開發
    // const salt = await bcrypt.genSalt(10);
    // userBody.password = await bcrypt.hash(userBody.password, salt);

    // Create new user in DB
    const savedUser = await repo.createUser(userBody);
  
    return{
      id: savedUser.id.toString(),
      ...userBody,
    };
};

export const deleteUser: (id: string) => Promise<void> = async (id) => {
  const result = await repo.deleteUserById(id)
  // console.log(result)
  if (!result) {
    throw new Error('User not found');
  }
}

export const updateUser: (id: string, update: Partial<UserBody>) => Promise<User | null> =
  async (id, update) => {
    // 這裡可選：驗證欄位格式
    if (update.role && !Object.values(UserRole).includes(update.role as UserRole)) {
      throw new Error('Invalid role');
    }

    if (update.testType && !Object.values(UserTestType).includes(update.testType as UserTestType)) {
      throw new Error('Invalid test type');
    }

    if (update.status && !Object.values(UserStatus).includes(update.status as UserStatus)) {
      throw new Error('Invalid status');
    }

    const updated = await repo.updateUserById(id, update);
    if (!updated) return null;

    const obj = updated.toObject();
    return {
      // id: updated.id.toString(),
      ...obj,
    };
  };