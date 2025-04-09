export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export type Task = {
    id: string
    name: string
    description: string
    testType: string
    inCharging: string
    status: TaskStatus
}
export type TaskBody = Omit<Task, 'id'>

export enum MachineStatus {
    IDLE = 'idle',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export type Machine = {
    id: string
    name: string
    description: string
    testType: string
    count: number
    status: MachineStatus
} 
export type MachineBody = Omit<Machine, 'id'>
  