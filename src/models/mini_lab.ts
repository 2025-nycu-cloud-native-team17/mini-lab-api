import mongoose from 'mongoose'

import { Todo } from '../types/todo'
import { TaskStatus, MachineStatus } from '../types/mini_lab' // Import enums

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
    timestamps: true
  }
)
miniLabMachineSchema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

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
    timestamps: true
  }
)
miniLabTaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false
})

export const MiniLabMachineModel = mongoose.models.MiniLabMachine || mongoose.model('MiniLabMachine', miniLabMachineSchema);
export const MiniLabTaskModel = mongoose.models.MiniLabTask || mongoose.model('MiniLabTask', miniLabTaskSchema);