import { describe, expect, it, vi, beforeEach } from 'vitest'
import { serverOf } from '../src/server'
import * as TodoService from '../src/services/todo'
import { Todo } from '../src/types/todo'

describe('Todo Routes Tests', () => {

  const server = serverOf()

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('GET /api/v1/todos', () => {
    it('should return all todos', async () => {
      // Arrange
      const mockTodos: Todo[] = [
        { id: '1', name: 'task1', description: 'desc 1', status: false },
        { id: '2', name: 'task2', description: 'desc 2', status: true }
      ]
      vi.spyOn(TodoService, 'getTodos').mockResolvedValue(mockTodos)

      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/todos'
      })
  
      // Assert
      expect(response.statusCode).toBe(200)
      expect(TodoService.getTodos).toHaveBeenCalledTimes(1)
      
      const responseBody = JSON.parse(response.body)
      expect(responseBody.todos).toEqual(mockTodos)
    })

    it('should handle getTodos service error', async () => {
      // Arrange
      vi.spyOn(TodoService, 'getTodos').mockRejectedValue(new Error('database error'))
      
      // Act
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/todos'
      })
      
      // Assert
      expect(response.statusCode).toBe(500)
      expect(TodoService.getTodos).toHaveBeenCalledTimes(1)
    })
  })

  describe('POST /api/v1/todos', () => {
    it('should reply a valid todo item', async () => {
      // Arrange
      const todoToCreate = { name: 'task', description: 'desc', status: false }
      const createdTodo = { id: '123', ...todoToCreate }
      
      vi.spyOn(TodoService, 'addTodo').mockResolvedValue(createdTodo as Todo)
      
      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/todos',
        payload: todoToCreate
      })
      
      // Assert
      expect(response.statusCode).toBe(201)
      expect(TodoService.addTodo).toHaveBeenCalledWith(todoToCreate)
      const body = JSON.parse(response.payload).todo
      expect(body.id).toBe('123')
      expect(body.name).toBe(todoToCreate.name)
    })

    it('should return 400, if meet ', async () => {
      // Arrange
      const invalidPayload = {}
      
      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/api/v1/todos',
        payload: invalidPayload
      })
      
      // Assert
      expect(response.statusCode).toBe(400) 
    })
  })
})