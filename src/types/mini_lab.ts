// data type for user
export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked', //請假
    DELETED = 'deleted', //離職(固定一個月清理一次離職人員資料)
    PENDING = 'pending', //待審核(新員工)
}

export type User = {
    id: string
    name: string //employee名稱
    email: string //employee信箱(公司分發)
    password: string //employee密碼(假定在這系統不能自行改密碼)
    role: string //employee角色(組長/組員)
    testType: string //employee測試類型
    group: string //員工所屬group
    inCharging: string[] //employee負責的測試
    status: UserStatus
    refreshToken: string //refresh token
}
export type UserBody = Omit<User, 'id'>

// data type for task
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
    inCharging: string[] 
    status: TaskStatus
}
export type TaskBody = Omit<Task, 'id'>


// data type for machine
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
  