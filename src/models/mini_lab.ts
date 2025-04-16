import mongoose from 'mongoose'

import { Todo } from '../types/todo'
import { UserStatus, UserTestType, UserRole, TaskStatus, MachineStatus, UserBody } from '../types/mini_lab' // Import enums

//name: 員工名稱
//email: 員工信箱(公司分發)
//password: 員工密碼(假定在這系統不能自行改密碼)
//role: 員工角色(組長/組員)
//testType: 員工測試類型
//inCharging: 員工負責的測試
//status: 員工狀態
const miniLabUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole), // Use UserRole enum
      required: true
    },
    testType: {
      type: String,
      enum: Object.values(UserTestType), // Use UserTestType enum
      required: true
    },
    status: {
      type: String,
      enum: Object.values(UserStatus), // Use UserStatus enum
      required: true
    },
    inCharging: {
      type: [String],
      required: false
    },
    refreshToken: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: "MiniLabUsers" // Avoid confusion 
  }
)
miniLabUserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false
})


//name: 機器名稱
//description: 機器描述
//testType: 機器測試類型
//count: 機器數量
//status: 機器狀態
const miniLabMachineSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    testType: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(MachineStatus), // Use MachineStatus enum
      required: true
    }
  },
  {
    timestamps: true,
    collection: "MiniLabMachines" // Avoid confusion 
  }
)
miniLabMachineSchema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

//name: 任務名稱
//description: 任務描述
//testType: 任務測試類型
//inCharging: 任務負責人
//status: 任務狀態
const miniLabTaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    testType: {
      type: String,
      required: true
    },
    inCharging: {
      type: [String],
      required: true
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus), // Use TaskStatus enum
      required: true
    }
  },
  {
    timestamps: true,
    collection: "MiniLabTasks" // Avoid confusion 
  }
)
miniLabTaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

export const MiniLabUserModel = mongoose.models.MiniLabUser || mongoose.model<UserBody>('MiniLabUser', miniLabUserSchema);
export const MiniLabMachineModel = mongoose.models.MiniLabMachine || mongoose.model('MiniLabMachine', miniLabMachineSchema);
export const MiniLabTaskModel = mongoose.models.MiniLabTask || mongoose.model('MiniLabTask', miniLabTaskSchema);