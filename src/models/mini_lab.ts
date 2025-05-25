import mongoose from 'mongoose'
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
    userId: {
      type: String,
      required: true,
      unique: true
    },
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
      type: [String],
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
    },
    busywindow: {
      type: [[Number]],
      required: true
    }
  },
  {
    timestamps: true,
    collection: "MiniLabUsers" // Avoid confusion 
  }
)
miniLabUserSchema.set('toJSON', {
  virtuals: true,          // 開啟虛擬屬性（如 id）
  versionKey: false,       // 移除 __v
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // 把 _id 轉成 id 欄位
    delete ret._id;
    delete ret.password;         // ❗移除敏感資訊
    delete ret.refreshToken;     // ❗移除 refresh token
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});


//name: 機器名稱
//description: 機器描述
//testType: 機器測試類型
//count: 機器數量
//status: 機器狀態
const miniLabMachineSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: true,
      unique: true
    },
    name: { 
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    testType: {
      type: [String],
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
    },
    busywindow: {
      type: [[Number]],
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
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

//name: 任務名稱
//description: 任務描述
//testType: 任務測試類型
//inCharging: 任務負責人
//status: 任務狀態
const miniLabTaskSchema = new mongoose.Schema(
  {
    // taskId: {
    //   type: String,
    //   required: true,
    //   unique: true
    // },
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
      // required: true
      default: []
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus), // Use TaskStatus enum
      // required: true
      default: TaskStatus.PENDING // 預設為 PENDING
    },
    duration: {
      type: Number,
      required: true
    },
    earliest_start: {
      type: Number,
      required: true
    },
    deadline: {
      type: Number,
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
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();  // 加上 id 欄位
    delete ret._id;               // 移除 _id 原始欄位
    delete ret.createdAt;         // 移除自動加的欄位
    delete ret.updatedAt;
    return ret;
  }
});

const miniLabAssignmentSchema = new mongoose.Schema(
  {
    // assignment_id: {
    //   type: String,
    //   required: true,
    //   unique: true
    // },
    task_id: {
      type: String,
      required: true,
      unique: true
    },
    task_name: {
      type: String,
      required: true
      // unique: true
    },
    worker_id: {
      type: String,
      required: true
    },
    machine_id: {
      type: String,
      required: true
    },
    start: {
      type: Number,
      required: true
    },
    end: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    collection: "MiniLabAssignments" // Avoid confusion
  }
)
miniLabAssignmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();   // 統一提供 id 欄位
    delete ret._id;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

export const MiniLabUserModel = mongoose.models.MiniLabUser || mongoose.model<UserBody>('MiniLabUser', miniLabUserSchema);
export const MiniLabMachineModel = mongoose.models.MiniLabMachine || mongoose.model('MiniLabMachine', miniLabMachineSchema);
export const MiniLabTaskModel = mongoose.models.MiniLabTask || mongoose.model('MiniLabTask', miniLabTaskSchema);
export const MiniLabAssignmentModel = mongoose.models.MiniLabAssignment || mongoose.model('MiniLabAssignment', miniLabAssignmentSchema);