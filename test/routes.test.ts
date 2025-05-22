import { beforeEach, describe, expect, it, vi, test } from 'vitest'
import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import { MiniLabRouter } from '../src/routes/mini_lab'
import * as service from '../src/services/mini_lab'
import { User, UserStatus, UserRole, UserTestType } from '../src/types/mini_lab'
import { Machine, MachineBody, MachineStatus } from '../src/types/mini_lab'
import { Task, TaskBody, TaskStatus } from '../src/types/mini_lab'

// mock service 層
vi.mock('../src/services/mini_lab')
vi.mock('../src/middleware/verifyJWT', () => ({
    __esModule: true,
    verifyJWT: (req, res, next) => {
        req.user = { id: '1', email:'test1@tsmc.com', role: 'leader' }
        next()
    }
  }))

vi.mock('../src/middleware/requireRole', () => ({
    __esModule: true,
    requireManagerRole: (_req, _res, next) => next()
  }))

vi.mock('../src/utils/logger', () => ({
    __esModule: true,
    logger: {
      info:  () => {},
      warn:  () => {},
      error: () => {},
    }
  }))

describe('Mini_lab Routes', () => {
    let app: Application

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use(cookieParser())  
        app.use(MiniLabRouter)
        vi.clearAllMocks()
    })

    it('GET /v1/machines should return all machines', async () => {
      const fakeMachines: Machine[] = [
        {id:'m001',name:'Thermal Chamber',description:'High-precision thermal cycling device',testType:'Thermal Testing',count:3,status:MachineStatus.IN_PROGRESS},
        {id:'m002',name:'Humidity Chamber',description:'Controlled humidity environment',testType:'Physical Property Testing',count:0,status:MachineStatus.IDLE}
      ];
  

      vi.mocked(service.getMachines).mockResolvedValue(fakeMachines)

      const res = await request(app).get('/v1/machines')

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(fakeMachines)
      expect(service.getMachines).toHaveBeenCalledTimes(1)
    })

    it('POST /v1/machines should create a machine', async () => {
      const newMachine: Machine = {id:'m001',name:'Thermal Chamber',description:'High-precision thermal cycling device',testType:'Thermal Testing',count:3,status:MachineStatus.IN_PROGRESS};
      vi.mocked(service.addMachine).mockResolvedValue(newMachine);
      const response = await request(app).post('/v1/machines').send(newMachine);
      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual(newMachine)
      expect(service.addMachine).toHaveBeenCalled()
    })

    it('PUT /v1/machines/:id should update a machine', async () => {
      const id = 'm001';
      const updateBody: Partial<Machine> = {name:'new name'};
      const updated: Machine = {id: 'm001', name:updateBody.name!, description:'High-precision thermal cycling device',testType:'Thermal Testing',count:3,status:MachineStatus.IN_PROGRESS};
      vi.mocked(service.updateMachineById).mockResolvedValue(updated);
      const res = await request(app).put(`/v1/machines/${id}`).send(updateBody);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
      expect(service.updateMachineById).toHaveBeenCalledWith(id, updateBody);

    })

    it('PUT /v1/machines/:id/:attribute should update one attribute', async () => {
      const id = 'm001', attr = 'count', value = 5;
      const updated: Machine = {id, name:'Thermal Chamber',description:'High-precision thermal cycling device',testType:'Thermal Testing',count:5,status:MachineStatus.IN_PROGRESS};
      vi.mocked(service.updateMachineAttributeById).mockResolvedValue(updated);
      const res = await request(app).put(`/v1/machines/${id}/${attr}`).send({value});
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
      expect(service.updateMachineAttributeById).toHaveBeenCalledWith(id, attr, value);
    });

    it('DELETE /v1/machines/:id should delete a machine', async () => {
      const id = 'm002';
      vi.mocked(service.deleteMachineById).mockResolvedValue({} as any);
      const res = await request(app).delete(`/v1/machines/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({msg:'Machine deleted successfully', result: {}});
      expect(service.deleteMachineById).toHaveBeenCalledWith(id);
    });

    // === Tasks ===
    it('GET /v1/tasks should return all tasks', async () => {
      const fakeTasks: Task[] = [
        {id:'t001',name:'Temp Ramp Test',description:'Run temperature ramp test',testType:'Thermal Testing',inCharging:['m001','m002'],createAt:new Date('2025-04-17T14:10:00.000Z'),dueDate: new Date('2025-04-20T14:10:00.000Z'),status:TaskStatus.IN_PROGRESS}
      ];
  
      vi.mocked(service.getTasks).mockResolvedValue(fakeTasks);
      const res = await request(app).get('/v1/tasks');
      expect(res.statusCode).toBe(200);

      // 把 JSON 里回来的日期字符串还原成 Date
      const tasks: Task[] = res.body.map((t: any) => ({
        ...t,
        createAt:  new Date(t.createAt),
        dueDate:   new Date(t.dueDate),
      }))

      expect(tasks).toEqual(fakeTasks);
      expect(service.getTasks).toHaveBeenCalledTimes(1);
    });

    it('POST /v1/tasks should create a task', async () => {
      const newTask = {id:'t001',name:'Temp Ramp Test',description:'Run temperature ramp test',testType:'Thermal Testing',inCharging:['m001','m002'],createAt:'2025-04-17T14:10:00.000Z',dueDate: '2025-04-17T14:10:00.000Z',status:TaskStatus.IN_PROGRESS}
      // const newTask: Task = {id:'t001',name:'Temp Ramp Test',description:'Run temperature ramp test',testType:'Thermal Testing',inCharging:['m001','m002'],createAt:new Date('2025-04-17T14:10:00.000Z'),dueDate: new Date('2025-04-20T14:10:00.000Z'),status:TaskStatus.IN_PROGRESS}
      
      vi.mocked(service.addTask).mockResolvedValue(newTask as any);
      const res = await request(app).post('/v1/tasks').send(newTask);

      // // 把 JSON 里回来的日期字符串还原成 Date
      // const tasks: Task ={
      //   ...res.body,
      //   createAt:  new Date(res.body.createAt),
      //   dueDate:   new Date(res.body.dueDate),
      // } 

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newTask);
      expect(service.addTask).toHaveBeenCalledWith(newTask);
    });

    it('PUT /v1/tasks/:id should update a task', async () => {
      const id = 't001';
      const updateBody: Partial<TaskBody> = {status:TaskStatus.COMPLETED};
      // const updated: Task = {id,name:'Temp Ramp Test',description:'Run temperature ramp test',testType:'Thermal Testing',inCharging:['m001'],dueDate: new Date('2025-04-20T14:10:00.000Z'),status:updateBody.status!,createAt:new Date('2025-04-17T14:44:06.019Z')};
      const updated = {id,name:'Temp Ramp Test',description:'Run temperature ramp test',testType:'Thermal Testing',inCharging:['m001'],dueDate: '2025-04-20T14:10:00.000Z',status:updateBody.status!,createAt:'2025-04-17T14:44:06.019Z'};
      vi.mocked(service.updateTaskById).mockResolvedValue(updated as any);
      const res = await request(app).put(`/v1/tasks/${id}`).send(updateBody);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
      expect(service.updateTaskById).toHaveBeenCalledWith(id, updateBody);
    });

    it('PUT /v1/tasks/:id/:attribute should update one field', async () => {
      const id = 't001', attr = 'status', value = TaskStatus.COMPLETED;
      const updated = {id,name:'Temp Ramp Test',description:'Run temperature ramp test',testType:'Thermal Testing',inCharging:['m001'],dueDate:'2025-04-22T00:00:00.000Z',status:value,createAt:'2025-04-17T14:44:06.019Z'};
      vi.mocked(service.updateTaskAttributeById).mockResolvedValue(updated as any);
      const res = await request(app).put(`/v1/tasks/${id}/${attr}`).send({value});
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updated);
      expect(service.updateTaskAttributeById).toHaveBeenCalledWith(id, attr, value);
    });

    it('DELETE /v1/tasks/:id should delete a task', async () => {
      const id = 't002';
      vi.mocked(service.deleteTaskById).mockResolvedValue({} as any);
      const res = await request(app).delete(`/v1/tasks/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({msg:'Task deleted successfully', result: {}});
      expect(service.deleteTaskById).toHaveBeenCalledWith(id);
    });

    // === User ===
    it('GET /v1/user should return one user', async () => {
        const fakeUser: User = { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: 'fake-refresh-token-1'}
        
        vi.mocked(service.getUserById).mockResolvedValue(fakeUser)
    
        const response = await request(app).get('/v1/user')
    
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeUser)
    })

    it('GET /v1/users should return all users', async () => {
        const fakeUsers: User[] = [
          { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: 'fake-refresh-token-1'},
          { id: '2', userId: '5678', name: 'test2', email: 'test2@tsmc.com', password: 'password', role: UserRole.MEMBER, testType: UserTestType.TEST2, status: UserStatus.BLOCKED, inCharging: [], refreshToken: 'fake-refresh-token-2'},
        ]
    
        vi.mocked(service.getUsers).mockResolvedValue(fakeUsers)
    
        const response = await request(app).get('/v1/users')
    
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeUsers)
    })

    it('GET /v1/user/:id should return one user', async () => {
        const fakeUser: User = { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: 'fake-refresh-token-1'}
          
        vi.mocked(service.getUserById).mockResolvedValue(fakeUser)
    
        const response = await request(app).get('/v1/user/:id')
    
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeUser)
    })

    it('POST /v1/user should return a new user', async () => {
        const newUser: User = { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: ''}
          
        vi.mocked(service.addUser).mockResolvedValue(newUser)
    
        const response = await request(app).post('/v1/user').send(newUser)
    
        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual(newUser)
        expect(service.addUser).toHaveBeenCalled()
    })

    it('DELETE /v1/user/:id should return NULL', async () => {
        const id = '42'

        vi.mocked(service.deleteUser).mockResolvedValue(undefined)

        const res = await request(app).delete(`/v1/user/${id}`)

        expect(res.status).toBe(204)
        expect(res.body).toEqual({})
        expect(service.deleteUser).toHaveBeenCalledWith(id) 
    })

    it('PUT /v1/user/:id should return updated user', async () => {
        const id = '1'
        const updatedBody: Partial<User> = { name: 'Bob Updated', status: UserStatus.BLOCKED}
        const updatedUser: User = { id: '1', userId: '1234', name: updatedBody.name!, email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: updatedBody.status!, inCharging: [], refreshToken: ''}

        vi.mocked(service.updateUser).mockResolvedValue(updatedUser)

        const res = await request(app).put(`/v1/user/${id}`).send(updatedBody)

        expect(res.status).toBe(200)
        expect(res.body).toEqual(updatedUser)
        expect(service.updateUser).toHaveBeenCalledWith(id, updatedBody) 
    })

    it('POST /v1/login should return accessToken', async () => {
        const credentials = { email: 'u1', password: 'p1' }
        type Tokens = {
            accessToken: string;
            refreshToken: string;
          };
        const result: Tokens = {
            accessToken: 'access-tkn',
            refreshToken: 'fresh-tkn',
        }

        vi.mocked(service.login).mockResolvedValue(result)

        const res = await request(app)
          .post('/v1/login')
          .send(credentials)
    
        expect(res.status).toBe(200)
        expect(res.body).toEqual({accessToken: result.accessToken})
    
        expect(service.login).toHaveBeenCalledTimes(1)
      })

    it('GET /v1/logout should return NULL', async () => {
        // const credentials = { email: 'u1', password: 'p1' }
        // type Tokens = {
        //     accessToken: string;
        //     refreshToken: string;
        //   };
        // const fakeToken: Tokens = {
        //     accessToken: 'access-tkn',
        //     refreshToken: 'fresh-tkn',
        // }
        const fakeToken = 'fresh-tkn'
        vi.mocked(service.logout).mockResolvedValue(undefined)
        const res = await request(app)
          .get('/v1/logout')
          .set('Cookie', `refreshToken=${fakeToken}`)

        expect(res.status).toBe(204)
        expect(res.body).toEqual({})
        expect(service.logout).toHaveBeenCalledTimes(1)
        expect(service.logout).toHaveBeenCalledWith(fakeToken)
      })
})