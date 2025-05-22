// test/mini_lab.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ModifyResult } from 'mongoose'

import * as repo from '../src/repo/mini_lab'
import * as service from '../src/services/mini_lab'
import { User, UserStatus, UserRole, UserTestType } from '../src/types/mini_lab'
import { Machine, MachineBody, MachineStatus } from '../src/types/mini_lab'
import { Task, TaskBody, TaskStatus } from '../src/types/mini_lab'

import { appConfig } from '../src/index'

// 1) 全 mock repo module
vi.mock('../src/repo/mini_lab')

describe('mini_lab service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // --- Machines ---
  it('getMachines 應該呼 repo.findAllMachines 並回傳結果', async () => {
    const fake: Machine[] = [{ id:'m1', name:'X', description:'D', testType:'T', count:0, status:MachineStatus.IDLE, createAt:'' }]
    vi.mocked(repo.findAllMachines).mockResolvedValue(fake)
    const out = await service.getMachines()
    expect(repo.findAllMachines).toHaveBeenCalled()
    expect(out).toEqual(fake)
  })

  it('addMachine 應該呼 repo.createMachine 並回傳新 machine', async () => {
    const body: MachineBody = { name:'N', description:'D', testType:'T' }
    const created: Machine = { id:'m2', ...body, count:0, status:MachineStatus.IDLE, createAt:'' }
    vi.mocked(repo.createMachine).mockResolvedValue(created)
    const out = await service.addMachine(body)
    expect(repo.createMachine).toHaveBeenCalledWith(body)
    expect(out).toEqual(created)
  })

  it('updateMachineById 應該呼 repo.updateMachineById', async () => {
    const updated: Machine = { id:'m3', name:'N', description:'D', testType:'T', count:1, status:MachineStatus.BUSY, createAt:'' }
    vi.mocked(repo.updateMachineById).mockResolvedValue(updated)
    const out = await service.updateMachineById('m3', { status:MachineStatus.IN_PROGRESS })
    expect(repo.updateMachineById).toHaveBeenCalledWith('m3', { status:MachineStatus.IN_PROGRESS })
    expect(out).toEqual(updated)
  })

  it('updateMachineAttributeById 應該轉成 partial 並呼 repo.updateMachineById', async () => {
    const upd: Machine = { id:'m4', name:'N', description:'D', testType:'T', count:2, status:MachineStatus.IDLE, createAt:'' }
    vi.mocked(repo.updateMachineById).mockResolvedValue(upd)
    const out = await service.updateMachineAttributeById('m4','count',2)
    expect(repo.updateMachineById).toHaveBeenCalledWith('m4',{count:2})
    expect(out).toEqual(upd)
  })

  it('deleteMachineById 應該呼 repo.deleteMachineById', async () => {
    const res: ModifyResult<Machine> = { acknowledged:true, deletedCount:1 }
    vi.mocked(repo.deleteMachineById).mockResolvedValue(res)
    const out = await service.deleteMachineById('m5')
    expect(repo.deleteMachineById).toHaveBeenCalledWith('m5')
    expect(out).toEqual(res)
  })

  // --- Tasks ---
  it('getTasks 應該呼 repo.findAllTasks 並回傳結果', async () => {
    const fake: Task[] = [{ id:'t1', name:'T', description:'D', testType:'T', inCharging:[], timestamps:'', updatedAt:'', dueDate:'', status:TaskStatus.PENDING }]
    vi.mocked(repo.findAllTasks).mockResolvedValue(fake)
    expect(await service.getTasks()).toEqual(fake)
    expect(repo.findAllTasks).toHaveBeenCalled()
  })

  it('addTask 應該呼 repo.createTask 並回傳新 task', async () => {
    const body: TaskBody = { name:'N', description:'D', testType:'T', inCharging:[], dueDate:'', status:TaskStatus.PENDING }
    const created: Task = { id:'t2', ...body, timestamps:'', updatedAt:'' }
    vi.mocked(repo.createTask).mockResolvedValue(created)
    expect(await service.addTask(body)).toEqual(created)
    expect(repo.createTask).toHaveBeenCalledWith(body)
  })

  it('updateTaskById 應該呼 repo.updateTaskById', async () => {
    const updated: Task = { id:'t3', name:'N', description:'D', testType:'T', inCharging:[], dueDate:'', status:TaskStatus.COMPLETED, timestamps:'', updatedAt:'' }
    vi.mocked(repo.updateTaskById).mockResolvedValue(updated)
    const out = await service.updateTaskById('t3',{status:'done'})
    expect(repo.updateTaskById).toHaveBeenCalledWith('t3',{status:'done'})
    expect(out).toEqual(updated)
  })

  it('updateTaskAttributeById 應該呼 repo.updateTaskById 的單一屬性', async () => {
    const upd: Task = { id:'t4', name:'N', description:'D', testType:'T', inCharging:[], dueDate:'', status:'pending', timestamps:'', updatedAt:'' }
    vi.mocked(repo.updateTaskById).mockResolvedValue(upd)
    expect(await service.updateTaskAttributeById('t4','status','pending')).toEqual(upd)
    expect(repo.updateTaskById).toHaveBeenCalledWith('t4',{status:'pending'})
  })

  it('deleteTaskById 應該呼 repo.deleteTaskById', async () => {
    const r: ModifyResult<Task> = { acknowledged:true, deletedCount:1 }
    vi.mocked(repo.deleteTaskById).mockResolvedValue(r)
    expect(await service.deleteTaskById('t5')).toEqual(r)
    expect(repo.deleteTaskById).toHaveBeenCalledWith('t5')
  })

  // --- User Auth ---
  describe('login', () => {
    const mockUserDoc: any = {
      id: 'u1',
      email: 'e@x.com',
      role: UserRole.MEMBER,
      password: 'pw',
      updateOne: vi.fn().mockResolvedValue(undefined)
    }

    it('找不到 user 要丟錯', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue(null)
      await expect(service.login('x','y')).rejects.toThrow('Login failed, User not found')
    })

    it('密碼不符要丟錯', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue({ ...mockUserDoc, password:'pw' })
      await expect(service.login('x','wrong')).rejects.toThrow('Login failed, Invalid password')
    })

    it('成功時要簽 token 並存 refreshToken', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue(mockUserDoc)
      const spySign = vi.spyOn(jwt, 'sign')
        .mockReturnValueOnce('atkn').mockReturnValueOnce('rtkn')
      const r = await service.login('e@x.com','pw')
      expect(r).toEqual({ accessToken:'atkn', refreshToken:'rtkn' })
      expect(mockUserDoc.updateOne).toHaveBeenCalledWith({ refreshToken:'rtkn' })
      spySign.mockRestore()
    })
  })

  it('logout 找不到 token 不會丟錯', async () => {
    vi.mocked(repo.findUserByToken).mockResolvedValue(null)
    await expect(service.logout('rtkn')).resolves.toBeUndefined()
  })

  it('logout 找到才會呼 updateOne', async () => {
    const doc: any = { updateOne: vi.fn().mockResolvedValue(undefined) }
    vi.mocked(repo.findUserByToken).mockResolvedValue(doc)
    await service.logout('rtkn')
    expect(doc.updateOne).toHaveBeenCalledWith({ refreshToken:'' })
  })

  describe('refreshAccessToken', () => {
    const userDoc: any = { id:'u2', email:'a@b', role:UserRole.MEMBER }
    it('找不到要丟錯', async () => {
      vi.mocked(repo.findUserByToken).mockResolvedValue(null)
      await expect(service.refreshAccessToken('x')).rejects.toThrow('Refresh token not found')
    })
    it('驗證失敗要丟錯', async () => {
        vi.mocked(repo.findUserByToken).mockResolvedValue(userDoc)
        // stub jwt.verify 回调给 err
        const verifySpy = vi
            .spyOn(jwt, 'verify')
            .mockImplementation((_token, _secret, cb) => cb(new Error('e'), null))

        await expect(service.refreshAccessToken('x'))
            .rejects.toThrowError('Refresh token verification failed')

        verifySpy.mockRestore()
        })
    it('成功要回傳新 accessToken', async () => {
      vi.mocked(repo.findUserByToken).mockResolvedValue(userDoc)
      vi.spyOn(jwt,'verify').mockImplementation((_t,_s,cb)=>cb(null,{email:'a@b'}))
      const spySign = vi.spyOn(jwt,'sign').mockReturnValue('newAtkn')
      await expect(service.refreshAccessToken('x')).resolves.toBe('newAtkn')
      spySign.mockRestore()
    })
  })

  // --- Users CRUD ---
  describe('getUsers / getUserById', () => {
    it('getUsers 要 map toObject()', async () => {
      const docs = [ { toObject: () => ({_id:'1', name:'A'}) } ] as any
      vi.mocked(repo.findAllUsers).mockResolvedValue(docs)
      const out = await service.getUsers()
      expect(out).toEqual([{ id:'1', name:'A' }])
    })
    it('getUserById 找不到回 null', async () => {
      vi.mocked(repo.findUserById).mockResolvedValue(null)
      await expect(service.getUserById('x')).resolves.toBeNull()
    })
    it('getUserById 找到要 map', async () => {
      const doc = { toObject: () => ({_id:'2', userId:'u', name:'B'}) } as any
      vi.mocked(repo.findUserById).mockResolvedValue(doc)
      const out = await service.getUserById('x')
      expect(out).toEqual({ id:'2', userId:'u', name:'B' })
    })
  })

  describe('addUser', () => {
    const good: UserBody = { userId:'u', name:'N', email:'e@x', password:'pw', role:UserRole.MEMBER, testType:UserTestType.TEST1, status:UserStatus.ACTIVE, inCharging:[], refreshToken:'' }
    it('缺欄位要丟錯', async () => {
      await expect(service.addUser({} as any)).rejects.toThrow('Email, password, and name are required')
    })
    it('role/testType/status 驗證', async () => {
      await expect(service.addUser({ ...good, role:'x' as any })).rejects.toThrow('Invalid role')
      await expect(service.addUser({ ...good, testType:'x' as any })).rejects.toThrow('Invalid test type')
      await expect(service.addUser({ ...good, status:'x' as any })).rejects.toThrow('Invalid status')
    })
    it('重複 email 要丟錯', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue({} as any)
      await expect(service.addUser(good)).rejects.toThrow('User already exists')
    })
    it('成功要呼 createUser 並回傳', async () => {
      vi.mocked(repo.findUserByEmail).mockResolvedValue(null)
      const saved = { id:'3', toObject:() => ({}) } as any
      vi.mocked(repo.createUser).mockResolvedValue(saved)
      const out = await service.addUser(good)
      expect(repo.createUser).toHaveBeenCalledWith(good)
      expect(out).toEqual({ id:'3', ...good })
    })
  })

  describe('deleteUser', () => {
    it('deleteUser 找不到要丟錯', async () => {
      vi.mocked(repo.deleteUserById).mockResolvedValue(null as any)
      await expect(service.deleteUser('x')).rejects.toThrow('User not found')
    })
    it('成功不丟錯', async () => {
      vi.mocked(repo.deleteUserById).mockResolvedValue({} as any)
      await expect(service.deleteUser('x')).resolves.toBeUndefined()
    })
  })

  describe('updateUser', () => {
    const goodUpdate = { name:'Z', status:UserStatus.PENDING }
    it('updateUser role/testType/status 驗證', async () => {
      await expect(service.updateUser('x',{ role:'x' as any })).rejects.toThrow('Invalid role')
      await expect(service.updateUser('x',{ testType:'x' as any })).rejects.toThrow('Invalid test type')
      await expect(service.updateUser('x',{ status:'x' as any })).rejects.toThrow('Invalid status')
    })
    it('找不到回 null', async () => {
      vi.mocked(repo.updateUserById).mockResolvedValue(null)
      await expect(service.updateUser('x',goodUpdate)).resolves.toBeNull()
    })
    it('成功要 map toObject()', async () => {
      const doc = { toObject: () => ({ id:'4', ...goodUpdate }) } as any
      vi.mocked(repo.updateUserById).mockResolvedValue(doc)
      const out = await service.updateUser('x', goodUpdate)
      expect(out).toEqual({ id:'4', ...goodUpdate })
    })
  })
})
