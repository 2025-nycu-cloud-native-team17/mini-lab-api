import { ModifyResult } from 'mongoose'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as repo from '../repo/mini_lab'
import { User, UserBody, Machine, MachineBody, Task, TaskBody, Assignment, AssignmentBody } from '../types/mini_lab'
import { UserRole, UserTestType, UserStatus } from '../types/mini_lab'
import { appConfig } from '../index';
import axios from 'axios'
import { machine } from 'os';


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
  console.log('id', id, 'attribute', attribute, 'value', value);
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

// 送出排程請求:
//   - 從資料庫取出上一輪的排程結果，保留startTime <= now的assignments，並更新assignment相應之user, machine 的busy_windows
// 收到response:
//   - assignment內的userId, machineId, taskId映射回userId, machineId, taskname(可讀性高)
//   - 接回送出請求前保留的assignments，合併成新的assignments
  

export const requestScheduler = async (): Promise<{ makespan: number; assignments: AssignmentBody[] }> => {
  const now = Math.floor(Date.now() / 1000)
  // const now = 0

  // 1. 從資料庫取出上一輪排程結果，保留已開始任務並更新 busy_windows
  const previousDocs = await repo.findAllAssignments()
  const previousAssignments = previousDocs.map(doc => doc.toJSON() as AssignmentBody)
  const keepAssignments: AssignmentBody[] = []
  const excludedTaskIds = new Set<string>()
  const extraBusyWindows = {
    users: new Map<string, [number, number][]>(),
    machines: new Map<string, [number, number][]>()
  }

  for (const a of previousAssignments) {
    if (a.end <= now) continue // 如果任務已結束，則不保留
    if (a.start <= now) {
      keepAssignments.push(a)
      excludedTaskIds.add(a.task_id)
      if (!extraBusyWindows.users.has(a.worker_id))
        extraBusyWindows.users.set(a.worker_id, [])
      if (!extraBusyWindows.machines.has(a.machine_id))
        extraBusyWindows.machines.set(a.machine_id, [])
      extraBusyWindows.users.get(a.worker_id)!.push([a.start, a.end])
      extraBusyWindows.machines.get(a.machine_id)!.push([a.start, a.end])
    }
  }

  // 2. 取得最新資料
  const users = await repo.findAllUsers()
  const machines = await repo.findAllMachines()
  // const tasks = await repo.findAllTasks()
  const tasks = (await repo.findAllTasks()).filter(t => !excludedTaskIds.has(t.id.toString()))


  // 建立 id ↔️ userId/machineId/taskName 對照表
  const userIdMap = new Map(users.map(u => [u.id.toString(), u.userId]))
  const machineIdMap = new Map(machines.map(m => [m.id.toString(), m.machineId]))
  const taskNameMap = new Map(tasks.map(t => [t.id.toString(), t.name]))

  // 3. 發送 scheduler 請求
  const requestPayload = {
    workers: users.map(user => ({
      id: user.id.toString(),
      types: user.testType,
      busy_windows: [
        ...(user.busywindow || []),
        ...(extraBusyWindows.users.get(user.id.toString()) || [])
      ]
    })),
    machines: machines.map(machine => ({
      id: machine.id.toString(),
      types: machine.testType,
      busy_windows: [
        ...(machine.busywindow || []),
        ...(extraBusyWindows.machines.get(machine.id.toString()) || [])
      ]
    })),
    tasks: tasks.map(task => ({
      id: task.id.toString(),
      type: task.testType,
      duration: task.duration,
      earliest_start: task.earliest_start,
      deadline: task.deadline
    }))
  }

  const response = await axios.post('http://mini-lab-scheduler:8000/schedule_with_busy', requestPayload)
  const newAssignmentsRaw = response.data.assignments
  const makespan = response.data.makespan

  // 4. 將 id 映射為 userId, machineId, taskName
  const newAssignments: AssignmentBody[] = []
  for (const a of newAssignmentsRaw) {
    const userId = userIdMap.get(a.worker_id)
    const machineId = machineIdMap.get(a.machine_id)
    const taskName = taskNameMap.get(a.task_id)

    if (userId && machineId && taskName) {
      newAssignments.push({
        assignmentId: a.assignment_id,
        task_id: a.task_id,
        task_name: taskName,
        worker_id: userId,
        machine_id: machineId,
        start: a.start,
        end: a.end
      })

      // 更新任務狀態與負責人
      await repo.updateTaskById(a.task_id, {
        status: 'assigned',
        inCharging: [userId, machineId]
      })
    }
  }

  // 5. 合併保留與新排程後儲存至資料庫
  const mergedAssignments = [...keepAssignments, ...newAssignments]
  await repo.deleteAssignments()
  const insertResult = await repo.addAssignments(mergedAssignments)

  return {
    makespan,
    assignments: insertResult
  }
}

export const getAssignments = async (): Promise<Assignment[]> => {
  const docs = await repo.findAllAssignments();
  return docs.map(doc => doc.toJSON() as Assignment);
};

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

export const getUsers = async (): Promise<User[]> => {
  const docs = await repo.findAllUsers();
  return docs.map(doc => doc.toJSON() as User);
};


export const getUserById = async (id: string): Promise<User | null> => {
  const doc = await repo.findUserById(id);
  if (!doc) return null;

  return doc.toJSON() as User;
};

export const addUser: (userBody: UserBody) => Promise<User> = async (userBody) => {
    // Validate request body
    if (!userBody.email || !userBody.password || !userBody.name) {
      throw new Error('Email, password, and name are required');
    }
  
    if (!Object.values(UserRole).includes(userBody.role as UserRole)) {
      throw new Error('Invalid role');
    }
  
    if (!Array.isArray(userBody.testType) || userBody.testType.some(t => !Object.values(UserTestType).includes(t))) {
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
  
    // return{
    //   id: savedUser.id.toString(),
    //   ...userBody,
    // };
    return savedUser.toJSON() as User;
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

    if (update.testType && (!Array.isArray(update.testType) || update.testType.some(t => !Object.values(UserTestType).includes(t)))) {
      throw new Error('Invalid test type');
    }

    if (update.status && !Object.values(UserStatus).includes(update.status as UserStatus)) {
      throw new Error('Invalid status');
    }

    const updated = await repo.updateUserById(id, update);
    if (!updated) return null;

    // const obj = updated.toObject();
    // return {
    //   // id: updated.id.toString(),
    //   ...obj,
    // };
    return updated.toJSON() as User;
  };