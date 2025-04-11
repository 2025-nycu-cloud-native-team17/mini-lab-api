import { Document, model, Schema, ModifyResult, UpdateQuery } from 'mongoose'

import { MiniLabUserModel, MiniLabMachineModel, MiniLabTaskModel } from '../models/mini_lab'
import { Machine, MachineBody } from '../types/mini_lab'
import { Task, TaskBody } from '../types/mini_lab'
import { User, UserBody } from '../types/mini_lab'

export interface MiniLabUserDocument extends Document, UserBody {}

export const findUserByEmail: (email: string) => Promise<MiniLabUserDocument | null> = (email) => MiniLabUserModel.findOne({ email: email }).exec()

export const findUserByToken: (refreshToken: string) => Promise<MiniLabUserDocument | null> = (refreshToken) => MiniLabUserModel.findOne({ refreshToken:refreshToken }).exec()

export const updateUserByEmail: (email: string, update: UpdateQuery<UserBody>) => Promise<MiniLabUserDocument | null> = (email, update) => MiniLabUserModel.findOneAndUpdate({ email }, update, { new: true }).exec()

export const findAllMachines: () => Promise<Array<Machine>> = () => MiniLabMachineModel.find().exec()

export const createMachine: (machineBody: MachineBody) => Promise<Machine> = (machineBody) =>
  MiniLabMachineModel.create(machineBody)

export const updateMachineById: (id: string, update: UpdateQuery<MachineBody>) => Promise<Machine | null> = (id, update) =>
  MiniLabMachineModel.findByIdAndUpdate(id, update, { new: true })

export const deleteMachineById: (id: string) => Promise<ModifyResult<Machine>> = (id) =>
  MiniLabMachineModel.findByIdAndDelete(id).exec()

export const findAllTasks: () => Promise<Array<Task>> = () => MiniLabTaskModel.find().exec()

export const createTask: (taskBody: TaskBody) => Promise<Task> = (taskBody) =>
  MiniLabTaskModel.create(taskBody)

export const updateTaskById: (id: string, update: UpdateQuery<TaskBody>) => Promise<Task | null> = (id, update) =>
  MiniLabTaskModel.findByIdAndUpdate(id, update, { new: true })

export const deleteTaskById: (id: string) => Promise<ModifyResult<Task>> = (id) =>
  MiniLabTaskModel.findByIdAndDelete(id).exec()
