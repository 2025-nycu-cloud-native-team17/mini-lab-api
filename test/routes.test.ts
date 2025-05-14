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

vi.mock('../src/utils/logger', () => ({
    __esModule: true,
    logger: {
      info:  () => {},
      warn:  () => {},
      error: () => {},
    }
  }))

describe('Mini_lab Routes', () => {
    let app: Application

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use(MiniLabRouter)
        vi.clearAllMocks()
    })

    it('GET /v1/user should return one user', async () => {
        const fakeUser: User = { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: 'fake-refresh-token-1'}
        
        vi.mocked(service.getUserById).mockResolvedValue(fakeUser)
    
        const response = await request(app).get('/v1/user')
    
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeUser)
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

    it('GET /v1/user/:id should return one user', async () => {
        const fakeUser: User = { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: 'fake-refresh-token-1'}
          
        vi.mocked(service.getUserById).mockResolvedValue(fakeUser)
    
        const response = await request(app).get('/v1/user/:id')
    
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(fakeUser)
    })

    it('POST /v1/user should return a new user', async () => {
        const newUser: User = { id: '1', userId: '1234', name: 'test1', email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: UserStatus.ACTIVE, inCharging: [], refreshToken: ''}
          
        vi.mocked(service.addUser).mockResolvedValue(newUser)
    
        const response = await request(app).post('/v1/user').send(newUser)
    
        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual(newUser)
        expect(service.addUser).toHaveBeenCalled()
    })

    it('DELETE /v1/user/:id should return NULL', async () => {
        const id = '42'

        vi.mocked(service.deleteUser).mockResolvedValue(undefined)

        const res = await request(app).delete(`/v1/user/${id}`)

        expect(res.status).toBe(204)
        expect(res.body).toEqual({})
        expect(service.deleteUser).toHaveBeenCalledWith(id) 
    })

    it('PUT /v1/user/:id should return updated user', async () => {
        const id = '1'
        const updatedBody: Partial<User> = { name: 'Bob Updated', status: UserStatus.BLOCKED}
        const updatedUser: User = { id: '1', userId: '1234', name: updatedBody.name!, email: 'test1@tsmc.com', password: 'password', role: UserRole.LEADER, testType: UserTestType.TEST1, status: updatedBody.status!, inCharging: [], refreshToken: ''}

        vi.mocked(service.updateUser).mockResolvedValue(updatedUser)

        const res = await request(app).put(`/v1/user/${id}`).send(updatedBody)

        expect(res.status).toBe(200)
        expect(res.body).toEqual(updatedUser)
        expect(service.updateUser).toHaveBeenCalledWith(id, updatedBody) 
    })

    it('POST /v1/login should return accessToken', async () => {
        const credentials = { email: 'u1', password: 'p1' }
        type Tokens = {
            accessToken: string;
            refreshToken: string;
          };
        const result: Tokens = {
            accessToken: 'access-tkn',
            refreshToken: 'fresh-tkn',
        }

        vi.mocked(service.login).mockResolvedValue(result)

        const res = await request(app)
          .post('/v1/login')
          .send(credentials)
    
        expect(res.status).toBe(200)
        expect(res.body).toEqual({accessToken: result.accessToken})
    
        expect(service.login).toHaveBeenCalledTimes(1)
      })
})