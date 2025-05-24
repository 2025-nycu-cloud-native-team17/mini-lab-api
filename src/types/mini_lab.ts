// data type for user
export enum UserStatus {
    ACTIVE = 'active',
    // INACTIVE = 'inactive',
    BLOCKED = 'blocked', //請假
    DELETED = 'deleted', //離職(固定一個月清理一次離職人員資料)
    PENDING = 'pending', //待審核(新員工)
}

export enum UserRole {
    MANAGER = 'manager', //管理者
    LEADER = 'leader', //組長
    MEMBER = 'member', //組員
}

export enum UserTestType {
    TEST1 = 'Thermal Testing', //溫度測試
    TEST2 = 'Electrical Testing', //電性測試
    TEST3 = 'Physical Property Testing', //物性測試
}

export type User = {
    id: string
    userId: string //employee編號
    name: string //employee名稱
    email: string //employee信箱(公司分發)
    password: string //employee密碼(假定在這系統不能自行改密碼)
    role: UserRole //employee角色(組長/組員)
    testType: UserTestType[] //employee測試類型
    status: UserStatus //employee狀態
    inCharging: string[] //employee負責的測試
    refreshToken: string //refresh token
    busywindow: number[][] //員工忙碌時間區間
}
export type UserBody = Omit<User, 'id'>

// data type for task
export enum TaskStatus {
    PENDING = 'pending', //待分配
    ASSIGNED = 'assigned', //已分配
    CANCELLED = 'cancelled', //已取消
    IN_PROGRESS = 'in_progress', //進行中
    COMPLETED = 'completed', //已完成
}

export type Task = {
    id: string
    // taskId: string
    name: string
    description: string
    testType: string
    inCharging: string
    status: TaskStatus
    duration: number
    earliestStart: number
    deadline: number
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
    machineId: string
    name: string
    description: string
    testType: string[]
    count: number
    status: MachineStatus
    busywindow: number[][] //機台忙碌時間區間
} 
export type MachineBody = Omit<Machine, 'id'>

export type Assignment ={
    assignmentId: string
    taskId: string
    machineId: string
    userId: string
    startTime: number
    endTime: number
}
  