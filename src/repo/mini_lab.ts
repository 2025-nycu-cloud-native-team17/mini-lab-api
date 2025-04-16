import { Document, model, Schema, ModifyResult, UpdateQuery } from 'mongoose'

import { MiniLabUserModel, MiniLabMachineModel, MiniLabTaskModel } from '../models/mini_lab'
import { Machine, MachineBody } from '../types/mini_lab'
import { Task, TaskBody } from '../types/mini_lab'
import { User, UserBody } from '../types/mini_lab'

// ----------------------User---------------------- //
export interface MiniLabUserDocument extends Document, UserBody {}

export const createUser: (userBody: UserBody) => Promise<MiniLabUserDocument> = (userBody) => MiniLabUserModel.create(userBody)

export const findAllUsers: () => Promise<Array<MiniLabUserDocument>> = () => MiniLabUserModel.find().exec()

export const findUserById: (id: string) => Promise<MiniLabUserDocument | null> = (id) => MiniLabUserModel.findById(id).exec()

export const findUserByEmail: (email: string) => Promise<MiniLabUserDocument | null> = (email) => MiniLabUserModel.findOne({ email: email }).exec()

export const findUserByToken: (refreshToken: string) => Promise<MiniLabUserDocument | null> = (refreshToken) => MiniLabUserModel.findOne({ refreshToken:refreshToken }).exec()

export const updateUserById: (id: string, update: UpdateQuery<UserBody>) => Promise<MiniLabUserDocument | null> = (id, update) => MiniLabUserModel.findByIdAndUpdate(id, update, { new: true })

export const deleteUserById: (id: string) => Promise<ModifyResult<User>> = (id) => MiniLabUserModel.findByIdAndDelete(id).exec()

// ----------------------Machine---------------------- //
export const findAllMachines: () => Promise<Array<Machine>> = () => MiniLabMachineModel.find().exec()

export const createMachine: (machineBody: MachineBody) => Promise<Machine> = (machineBody) =>
  MiniLabMachineModel.create(machineBody)

export const updateMachineById: (id: string, update: UpdateQuery<MachineBody>) => Promise<Machine | null> = (id, update) =>
  MiniLabMachineModel.findByIdAndUpdate(id, update, { new: true })

export const deleteMachineById: (id: string) => Promise<ModifyResult<Machine>> = (id) =>
  MiniLabMachineModel.findByIdAndDelete(id).exec()

// ----------------------Task---------------------- //
export const findAllTasks: () => Promise<Array<Task>> = () => MiniLabTaskModel.find().exec()

export const createTask: (taskBody: TaskBody) => Promise<Task> = (taskBody) =>
  MiniLabTaskModel.create(taskBody)

export const updateTaskById: (id: string, update: UpdateQuery<TaskBody>) => Promise<Task | null> = (id, update) =>
  MiniLabTaskModel.findByIdAndUpdate(id, update, { new: true })

export const deleteTaskById: (id: string) => Promise<ModifyResult<Task>> = (id) =>
  MiniLabTaskModel.findByIdAndDelete(id).exec()
