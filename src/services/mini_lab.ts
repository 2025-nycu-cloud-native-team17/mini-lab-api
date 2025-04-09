import { ModifyResult } from 'mongoose'

import * as repo from '../repo/mini_lab'
import { Machine, MachineBody, Task, TaskBody } from '../types/mini_lab'

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