import { describe, expect, it, beforeAll, afterAll, beforeEach } from 'vitest'
import mongoose from 'mongoose'
import * as TodoService from '../src/services/todo'
import TodoModel from '../src/models/todo'
import dotenv from 'dotenv'

dotenv.config()
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || ''

describe('Todo Service Tests', () => {
  beforeAll(async () => {
    const connection = await mongoose.connect(MONGO_CONNECTION_STRING)
    expect(connection).toBeDefined()
  })

  beforeEach (async () => {
    await TodoModel.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.connection.close()
    expect(mongoose.connection.readyState).toBe(0)
  })

  describe('getTodos', () => {
    it('should get todos from db', async () => {
      // Arrange
      await TodoModel.create([
        { name: 'task 1', description: 'describe 1', status: false },
        { name: 'task 2', description: 'describe 2', status: true }
      ])
            
      // Act
      const todos = await TodoService.getTodos()
      const todoNames = todos.map(t => t.name).sort();

      // Assert
      expect(todos.length).toBe(2)
      expect(todoNames).toEqual(['task 1', 'task 2']);
    })
  })

  describe('addTodo', () => {
    it('should create a todo', async () => {
      // Arrange
      const todo = { name: 'task 1', description: 'describe 1', status: false }

      // Act
      const result = await TodoService.addTodo(todo)
      const savedTodo = await TodoModel.findById(result.id)
      
      // Assert      
      expect(savedTodo).not.toBeNull()
      expect(savedTodo?.name).toBe(todo.name)
      expect(savedTodo?.description).toBe(todo.description)
      expect(savedTodo?.status).toBe(todo.status)
    })
  })

  describe('updateTodoStatus', () => {
    it('should update a exist data', async () => {
      // Arrange
      const initialTodo = await TodoModel.create({ 
        name: 'test task', 
        description: 'test description', 
        status: false 
      })
      const todoId = initialTodo._id.toString()
      const newStatus = true

      // Act
      const updatedTodo = await TodoService.updateTodoStatus(todoId, newStatus)
      const todoInDb = await TodoModel.findById(todoId)

      // Assert
      expect(updatedTodo).not.toBeNull()
      expect(todoInDb?.status).toBe(newStatus)
    })
    
    it('should return null if mentiond id is invalid', async () => {
      // Arrange
      const invalidId = new mongoose.Types.ObjectId().toString()

      // Act
      const result = await TodoService.updateTodoStatus(invalidId, true)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('deleteTodo', () => {
    it('should remove a exist data', async () => {
      // Arrange
      const initialTodo = await TodoModel.create({ 
        name: 'test task', 
        description: 'test description', 
        status: false 
      })
      const todoId = initialTodo._id.toString()

      // Act
      const result = await TodoService.deleteTodo(todoId)
      const todoInDb = await TodoModel.findById(todoId)

      // Assert
      expect(result).toBeTruthy()
      expect(todoInDb).toBeNull()
    })
  })
})