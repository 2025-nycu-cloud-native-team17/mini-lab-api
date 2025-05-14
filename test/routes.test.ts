import { beforeEach, describe, expect, it, vi, test } from 'vitest'
import express, { Application } from 'express'
import request from 'supertest'
import { MiniLabRouter } from '../src/routes/mini_lab'
import * as service from '../src/services/mini_lab'
import { User, UserStatus, UserRole, UserTestType } from '../src/types/mini_lab'

// mock service 層
vi.mock('../src/services/mini_lab')
vi.mock('../src/middleware/verifyJWT', () => ({
    __esModule: true,
    verifyJWT: (req, res, next) => {
        req.user = { id: '1', email:'test1@tsmc.com', role: 'leader' }
        next()
    }
  }))
vi.mock('../src/middleware/requireRole', () => ({
    __esModule: true,
    requireManagerRole: (_req, _res, next) => next()
  }))

describe('Mini_lab Routes', () => {
    let app: Application

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use(MiniLabRouter)
        vi.clearAllMocks()
    })

    it('GET /v1/users should return all users', async () => {
        const fakeUsers: User[] = [
          { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: 'fake-refresh-token-1'},
          { id: '2', userId: '5678', name: 'test2', email: 'test2@tsmc.com', password: 'password', role: UserRole.MEMBER, testType: UserTestType.TEST2, status: UserStatus.BLOCKED, inCharging: [], refreshToken: 'fake-refresh-token-2'},
        ]
    
        vi.mocked(service.getUsers).mockResolvedValue(fakeUsers)
    
        const response = await request(app).get('/v1/users')
    
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeUsers)
      })
})