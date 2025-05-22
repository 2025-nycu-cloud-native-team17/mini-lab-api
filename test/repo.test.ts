// test/mini_lab.repo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ModifyResult } from 'mongoose'

vi.mock('../src/models/mini_lab', () => {
  const create = vi.fn()
  const find = vi.fn()
  const findOne = vi.fn()
  const findById = vi.fn()
  const findByIdAndUpdate = vi.fn()
  const findByIdAndDelete = vi.fn()
  return {
    MiniLabUserModel: { create, find, findOne, findById, findByIdAndUpdate, findByIdAndDelete },
    MiniLabMachineModel: { create: vi.fn(), find: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
    MiniLabTaskModel: { create: vi.fn(), find: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
  }
})

import {
  MiniLabUserModel,
  MiniLabMachineModel,
  MiniLabTaskModel
} from '../src/models/mini_lab'
import * as repo from '../src/repo/mini_lab'
import { UserBody, MachineBody, TaskBody } from '../src/types/mini_lab'

describe('mini_lab repo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // --- User ---
  it('createUser should call MiniLabUserModel.create', async () => {
    const body: UserBody = { userId:'u1', name:'N', email:'e@x', password:'pw', role:'member', testType:'Thermal Testing', status:'active', inCharging:[], refreshToken:'' }
    const doc = { ...body, id:'1' }
    vi.mocked(MiniLabUserModel.create).mockResolvedValue(doc as any)
    const out = await repo.createUser(body)
    expect(MiniLabUserModel.create).toHaveBeenCalledWith(body)
    expect(out).toBe(doc)
  })

  it('findAllUsers should call find().exec()', async () => {
    const docs = [{ id:'1' }]
    vi.mocked(MiniLabUserModel.find).mockReturnValue({ exec: vi.fn().mockResolvedValue(docs) } as any)
    const out = await repo.findAllUsers()
    expect(MiniLabUserModel.find).toHaveBeenCalled()
    expect(out).toBe(docs)
  })

  it('findUserById should call findById(id).exec()', async () => {
    const doc = { id:'1' }
    vi.mocked(MiniLabUserModel.findById).mockReturnValue({ exec: vi.fn().mockResolvedValue(doc) } as any)
    const out = await repo.findUserById('1')
    expect(MiniLabUserModel.findById).toHaveBeenCalledWith('1')
    expect(out).toBe(doc)
  })

  it('findUserByEmail should call findOne({email}).exec()', async () => {
    const doc = { id:'1' }
    vi.mocked(MiniLabUserModel.findOne).mockReturnValue({ exec: vi.fn().mockResolvedValue(doc) } as any)
    const out = await repo.findUserByEmail('e@x')
    expect(MiniLabUserModel.findOne).toHaveBeenCalledWith({ email:'e@x' })
    expect(out).toBe(doc)
  })

  it('findUserByToken should call findOne({refreshToken}).exec()', async () => {
    const doc = { id:'1' }
    vi.mocked(MiniLabUserModel.findOne).mockReturnValue({ exec: vi.fn().mockResolvedValue(doc) } as any)
    const out = await repo.findUserByToken('rtkn')
    expect(MiniLabUserModel.findOne).toHaveBeenCalledWith({ refreshToken:'rtkn' })
    expect(out).toBe(doc)
  })

  it('updateUserById should call findByIdAndUpdate and return result', async () => {
    const updated = { id:'1' }
    vi.mocked(MiniLabUserModel.findByIdAndUpdate).mockResolvedValue(updated as any)
    const out = await repo.updateUserById('1', { name:'Z' })
    expect(MiniLabUserModel.findByIdAndUpdate).toHaveBeenCalledWith('1',{ name:'Z' },{ new:true })
    expect(out).toBe(updated)
  })

  it('deleteUserById should call findByIdAndDelete(id).exec()', async () => {
    const res: ModifyResult<any> = { acknowledged:true, deletedCount:1 }
    vi.mocked(MiniLabUserModel.findByIdAndDelete).mockReturnValue({ exec: vi.fn().mockResolvedValue(res) } as any)
    const out = await repo.deleteUserById('1')
    expect(MiniLabUserModel.findByIdAndDelete).toHaveBeenCalledWith('1')
    expect(out).toBe(res)
  })

  // --- Machine ---
  it('findAllMachines should call find().exec()', async () => {
    const arr = [{ id:'m1' }]
    vi.mocked(MiniLabMachineModel.find).mockReturnValue({ exec: vi.fn().mockResolvedValue(arr) } as any)
    expect(await repo.findAllMachines()).toBe(arr)
    expect(MiniLabMachineModel.find).toHaveBeenCalled()
  })

  it('createMachine should call create(body)', async () => {
    const body: MachineBody = { name:'M', description:'D', testType:'T' }
    const m = { id:'m2', ...body }
    vi.mocked(MiniLabMachineModel.create).mockResolvedValue(m as any)
    expect(await repo.createMachine(body)).toBe(m)
    expect(MiniLabMachineModel.create).toHaveBeenCalledWith(body)
  })

  it('updateMachineById should call findByIdAndUpdate', async () => {
    const m = { id:'m3' }
    vi.mocked(MiniLabMachineModel.findByIdAndUpdate).mockResolvedValue(m as any)
    expect(await repo.updateMachineById('m3',{status:'busy'})).toBe(m)
    expect(MiniLabMachineModel.findByIdAndUpdate).toHaveBeenCalledWith('m3',{status:'busy'},{ new:true })
  })

  it('deleteMachineById should call findByIdAndDelete(id).exec()', async () => {
    const res: ModifyResult<any> = { acknowledged:true, deletedCount:1 }
    vi.mocked(MiniLabMachineModel.findByIdAndDelete).mockReturnValue({ exec: vi.fn().mockResolvedValue(res) } as any)
    expect(await repo.deleteMachineById('m4')).toBe(res)
    expect(MiniLabMachineModel.findByIdAndDelete).toHaveBeenCalledWith('m4')
  })

  // --- Task ---
  it('findAllTasks should call find().exec()', async () => {
    const arr = [{ id:'t1' }]
    vi.mocked(MiniLabTaskModel.find).mockReturnValue({ exec: vi.fn().mockResolvedValue(arr) } as any)
    expect(await repo.findAllTasks()).toBe(arr)
    expect(MiniLabTaskModel.find).toHaveBeenCalled()
  })

  it('createTask should call create(body)', async () => {
    const body: TaskBody = { name:'T', description:'D', testType:'T', inCharging:[], dueDate:'', status:'pending' }
    const t = { id:'t2', ...body }
    vi.mocked(MiniLabTaskModel.create).mockResolvedValue(t as any)
    expect(await repo.createTask(body)).toBe(t)
    expect(MiniLabTaskModel.create).toHaveBeenCalledWith(body)
  })

  it('updateTaskById should call findByIdAndUpdate', async () => {
    const t = { id:'t3' }
    vi.mocked(MiniLabTaskModel.findByIdAndUpdate).mockResolvedValue(t as any)
    expect(await repo.updateTaskById('t3',{status:'done'})).toBe(t)
    expect(MiniLabTaskModel.findByIdAndUpdate).toHaveBeenCalledWith('t3',{status:'done'},{ new:true })
  })

  it('deleteTaskById should call findByIdAndDelete(id).exec()', async () => {
    const res: ModifyResult<any> = { acknowledged:true, deletedCount:1 }
    vi.mocked(MiniLabTaskModel.findByIdAndDelete).mockReturnValue({ exec: vi.fn().mockResolvedValue(res) } as any)
    expect(await repo.deleteTaskById('t4')).toBe(res)
    expect(MiniLabTaskModel.findByIdAndDelete).toHaveBeenCalledWith('t4')
  })
})
