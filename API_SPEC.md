# API Spec
##### GET /v1/test_route: (測試用)
* 功能描述: 快速測試前端能否打api server。
* INPUT: none
* OUTPUT: none
* Http Code:
    * 200 OK
    * 404 Not Found
```
request:
GET http://localhost:8888/api/v1/test_route

response:
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-CoXeLv72DogSLFY+gd4CGc4QwaQ"
Date: Thu, 17 Apr 2025 12:50:41 GMT
Connection: close

{
  "msg": "route work successfully!"
}
```

##### POST /v1/login: 
* 功能描述: user登入，取得accessToken。
* INPUT: email、password
* OUTPUT: accessToken寫在response、refreshToken寫在cookie傳回。
* Http Code:
    * 200 OK
    * 400 Bad Request: 少了email or password。
    * 401 Unauthorized: email or password錯誤。確切原因會寫在response裡。
```
POST http://localhost:8888/api/v1/login
Content-Type: application/json

{
  "email": "user1@example.com",
  "password": "user1"
}

HTTP/1.1 200 OK
X-Powered-By: Express
Set-Cookie: jwt=eyJhbGc...; Max-Age=86400; Path=/; Expires=Fri, 18 Apr 2025 10:07:44 GMT; HttpOnly
Content-Type: application/json; charset=utf-8
Content-Length: 250
ETag: W/"fa-FRUvwz3qYbEBjekWc6qgxmPH88E"
Date: Thu, 17 Apr 2025 10:07:44 GMT
Connection: close

{
  "accessToken": "eyJhbG..."
}
```
##### GET /v1/logout: 
* 功能描述: user登出，刪掉cookie和DB裡的refreshToken。
* INPUT: 讓browser自動帶cookie過來就好。
* OUTPUT: none
* Http Code:
    * 204 No Content
```
GET http://localhost:8888/api/v1/logout
Cookie: 
refreshToken=eyJhbG...

HTTP/1.1 204 No Content
X-Powered-By: Express
Set-Cookie: jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly
ETag: W/"a-bAsFyilMr4Ra1hIU5PyoyFRunpI"
Date: Thu, 17 Apr 2025 10:43:44 GMT
Connection: close
```

##### GET /v1/refresh: 
* 功能描述: 用refreshToken刷新accessToken。
* INPUT: 讓browser自動帶cookie過來就好。
* OUTPUT: accessToken寫在response傳回。
* Http Code:
    * 200 OK
    * 401 Unauthorized
        * `"No refresh token in cookies"`
    * 403 Forbidden
        * `"Refresh token not found in DB"`
        * `"Refresh token verification failed"`
```
GET http://localhost:8888/api/v1/refresh
Cookie: refreshToken=eyJhbG...

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 249
ETag: W/"f9-GmNWsna9Rv5y4Ido8oKVLr9QZnk"
Date: Thu, 17 Apr 2025 12:39:49 GMT
Connection: close

{
  "accessToken": "eyJhb..."
}
```
##### GET /v1/test_verifyJWT: (測試用)
* 功能描述: 可測試前端能否用accessToken過路由保護。
* INPUT: 把accessToken放在Header裡頭送過來。
* OUTPUT: none
* Http Code:
    * 200 OK
    * 401 Unauthorized
        * `"no accessToken in Header"`
    * 403 Forbidden
        * `"Invalid accessToken"`
```
GET http://localhost:8888/api/v1/test_verifyJWT
Authorization: Bearer {accessToken}

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 33
ETag: W/"21-xeziw3sKtb2fNNUJm7yCnUcY7vs"
Date: Thu, 17 Apr 2025 12:46:56 GMT
Connection: close

{
  "msg": "verifyJWT successfully!"
}
```
##### GET /v1/users:
* 功能描述: 撈回資料庫所有user(只傳回特定attribute)。
* INPUT: 把accessToken放在Header裡頭送過來。
* OUTPUT: 所有user資料。
* Http Code:
    * 200 OK
    * 401 Unauthorized
        * `"no accessToken in Header"`
    * 403 Forbidden
        * `"Invalid accessToken"`
```
GET http://localhost:8888/api/v1/users
Authorization: Bearer {accessToken}

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 452
ETag: W/"1c4-GDi7Q6YwPc/FO89XyZLjjuWwnm4"
Date: Thu, 17 Apr 2025 13:02:38 GMT
Connection: close

[
  {
    "id": "6800eb6f039f52a3ac6b140b",
    "userId": "0001",
    "name": "user1",
    "testType": "Physical Property Testing",
    "inCharging": [],
    "updatedAt": "2025-04-17T12:39:36.944Z"
  },
  ...(略)
]
```
##### GET /v1/user/:id :
* 功能描述: 用:id撈回特定user(傳回所有attribute)。
* INPUT: 把accessToken放在Header裡頭送過來。
* OUTPUT: 目標單筆user資料。
* Http Code:
    * 200 OK
    * 401 Unauthorized
        * `"no accessToken in Header"`
    * 403 Forbidden
        * `"Invalid accessToken"`
```
GET http://localhost:8888/api/v1/user/6800eb6f039f52a3ac6b140b
Authorization: Bearer {accessToken}

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 221
ETag: W/"dd-sPbwKy2ggU735G3C3HrjqzWdvpk"
Date: Thu, 17 Apr 2025 13:12:42 GMT
Connection: close

{
  "id": "6800eb6f039f52a3ac6b140b",
  "userId": "0001",
  "name": "user1",
  "email": "user1@example.com",
  "role": "manager",
  "testType": "Physical Property Testing",
  "inCharging": [],
  "status": "active",
  "updatedAt": "2025-04-17T12:39:36.944Z"
}
```
##### POST /v1/user :
* 功能描述: 新增一筆user。只有管理員(manager)有權限使用此功能。
* INPUT: 把accessToken放在Header裡頭送過來。
* OUTPUT: 新增user之資料。
* Http Code:
    * 201 Created
    * 400 Bad Request
        * `"Email, password, and name are required"`
        * `"Invalid role"`: 只接受 {"manager", "leader", "member"}
        * `"Invalid test type"`: 只接受 {"Thermal Testing", "Electrical Testing", "Physical Property Testing"}
        * `"Invalid status"`: 只接受 {"active", "blocked", "pending"}
        * `"User already exists"`: email不能重複
    * 401 Unauthorized
        * `"no accessToken in Header"`
    * 403 Forbidden
        * `"Invalid accessToken"`
        * `"Only managers can perform this action"`
```
POST http://localhost:8888/api/v1/user
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "userId": "0004",
    "name": "add",
    "email": "add@example.com",
    "password": "add",
    "role": "manager",
    "testType": "Physical Property Testing",
    "status": "active"
}

HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 179
ETag: W/"b3-X9aytiBMKJUu+edfYNoI8uMJmbg"
Date: Thu, 17 Apr 2025 13:34:09 GMT
Connection: close

{
  "id": "68010351b7ba8ff7350669df",
  "userId": "0004",
  "name": "add",
  "email": "add@example.com",
  "password": "add",
  "role": "manager",
  "testType": "Physical Property Testing",
  "status": "active"
}
```
##### DELETE /v1/user/:id :
* 功能描述: 刪除特定user。
* INPUT: 把accessToken放在Header裡頭送過來。
* OUTPUT: 
* Http Code:
    * 200 OK
    * 400 Bad Request
        * User not found
    * 401 Unauthorized
        * `"no accessToken in Header"`
    * 403 Forbidden
        * `"Invalid accessToken"`
```
DELETE  http://localhost:8888/api/v1/user/68010597060a6c14705fddd8
Authorization: Bearer {{accessToken}}

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 39
ETag: W/"27-27o4zzUjhHNmthTJyia4gBCjpos"
Date: Thu, 17 Apr 2025 13:44:08 GMT
Connection: close

{
  "message": "User deleted successfully"
}
```

##### PUT /v1/user/:id :
* 功能描述: 修改特定user資料。
* INPUT: 把accessToken放在Header裡頭送過來。
* OUTPUT: 
* Http Code:
    * 200 OK
    * 400 Bad Request
        * `"Invalid role"`: 只接受 {"manager", "leader", "member"}
        * `"Invalid test type"`: 只接受 {"Thermal Testing", "Electrical Testing", "Physical Property Testing"}
        * `"Invalid status"`: 只接受 {"active", "blocked", "pending"}
    * 401 Unauthorized
        * `"no accessToken in Header"`
    * 403 Forbidden
        * `"Invalid accessToken"`
        * `"no authencation to modify this data"`
    * 404 
        * `"User not found"`
```
PUT http://localhost:8888/api/v1/user/680112c024a8cf6964f6ab32
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "userId": "0004",
    "name": "add",
    "email": "add@example.com",
    "password": "add",
    "role": "manager",
    "testType": "Physical Property Testing",
    "status": "active"
}

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 300
ETag: W/"12c-M6GV6GZnZpAO2fMrO9ESlwIdcuA"
Date: Thu, 17 Apr 2025 14:44:06 GMT
Connection: close

{
  "_id": "680112c024a8cf6964f6ab32",
  "userId": "0004",
  "name": "add",
  "email": "add@example.com",
  "password": "add",
  "role": "manager",
  "testType": "Physical Property Testing",
  "status": "active",
  "inCharging": [],
  "refreshToken": "",
  "timestamps": "2025-04-17T14:40:00.921Z",
  "updatedAt": "2025-04-17T14:44:06.019Z",
  "__v": 0
}
```

##### GET /v1/machines:
* 功能描述: 撈回所有 machine (只傳回特定屬性)。
* INPUT: 把 accessToken 放在 Header 裡頭送過來。
* OUTPUT: 所有 machine 資料。
* Http Code:
    * 200 OK
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken"
```
GET http://localhost:8888/api/v1/machines
Authorization: Bearer {accessToken}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "m001",
    "name": "Thermal Chamber",
    "description": "High‑precision thermal cycling device",
    "testType": "Thermal Testing",
    "count": 3,
    "status": "in_progress",
    "timestamps": "2025-04-17T13:50:00.000Z"
    "updatedAt": "2025-04-17T14:44:06.019Z",
  },
  ...
]
```

##### POST /v1/machines:
* 功能描述: 新增 machine (只有 manager 權限)。
* INPUT: Header 帶入 accessToken，Body JSON 含 name、description、testType。
* OUTPUT: 新增 machine 資料。
* Http Code:
    * 201 Created
    * 400 Bad Request: "Name, description, and testType are required" / "Invalid testType"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken" / "Only managers can perform this action"
```
POST http://localhost:8888/api/v1/machines
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Humidity Chamber",
  "description": "Controlled humidity environment",
  "testType": "Physical Property Testing"
}

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "id": "m002",
  "name": "Humidity Chamber",
  "description": "Controlled humidity environment",
  "testType": "Physical Property Testing",
  "count": 0,
  "status": "idle",
  "timestamps": "2025-04-17T15:00:00.000Z"
  "updatedAt": "2025-04-17T14:44:06.019Z",
}
```

##### PUT /v1/machines/:id:
* 功能描述: 修改特定 machine (full update)。
* INPUT: Header 帶入 accessToken，Body JSON 含 name、description、testType、status。
* OUTPUT: 修改後的 machine 資料。
* Http Code:
    * 200 OK
    * 400 Bad Request: "Invalid testType" / "Invalid status"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken"
    * 404 Not Found: "Machine not found"
```
PUT http://localhost:8888/api/v1/machines/m001
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Thermal Chamber Pro",
  "description": "Upgraded thermal cycling device",
  "testType": "Thermal Testing",
  "status": "in_progress"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id": "m001",
  "name": "Thermal Chamber Pro",
  "description": "Upgraded thermal cycling device",
  "testType": "Thermal Testing",
  "count": 3,
  "status": "in_progress",
  "timestamps": "2025-04-17T13:50:00.000Z"
  "updatedAt": "2025-04-17T14:44:06.019Z",
}
```

##### PUT /v1/machines/:id/:attribute:
* 功能描述: 更新 machine 的單一屬性 (attribute)。
* INPUT: Header 帶入 accessToken，Body JSON 含該 attribute 的新值。
* OUTPUT: 修改後的 machine 屬性資料。
* Http Code:
    * 200 OK
    * 400 Bad Request: "Invalid attribute" / "Invalid value"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken"
    * 404 Not Found: "Machine not found"
```
PUT http://localhost:8888/api/v1/machines/m001/count
Authorization: Bearer {accessToken}
Content-Type: application/json

{ "count": 5 }

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "id": "m001", "count": 5 }
```

##### DELETE /v1/machines/:id:
* 功能描述: 刪除特定 machine。
* INPUT: 把 accessToken 放在 Header 裡頭送過來。
* OUTPUT: 刪除回應訊息。
* Http Code:
    * 200 OK
    * 400 Bad Request: "Machine not found"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken"
```
DELETE http://localhost:8888/api/v1/machines/m002
Authorization: Bearer {accessToken}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "message": "Machine deleted successfully" }
```

##### GET /v1/tasks:
* 功能描述: 撈回所有 task (只傳回特定屬性)。
* OUTPUT: 所有 task 資料。
* Http Code:
    * 200 OK
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken"
```
GET http://localhost:8888/api/v1/tasks
Authorization: Bearer {accessToken}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "t001",
    "name": "Temp Ramp Test",
    "description": "Run temperature ramp test",
    "testType": "Thermal Testing",
    "inCharging": ["m001","m002"],
    "timestamps": "2025-04-17T14:10:00.000Z",
    "updatedAt": "2025-04-17T14:44:06.019Z",
    "dueDate": "2025-04-20T00:00:00.000Z",
    "status": "pending"
  },
  ...
]
```

##### POST /v1/tasks:
* 功能描述: 新增 task (manager / leader 權限)。
* INPUT: Header 帶入 accessToken，Body JSON 含 name、description、testType、inCharging、dueDate、status。
* OUTPUT: 新增 task 資料。
* Http Code:
    * 201 Created
    * 400 Bad Request: "Name, description, testType, inCharging, dueDate and status are required" / "Invalid status"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken" / "Insufficient permissions"
```
POST http://localhost:8888/api/v1/tasks
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Temp Ramp Test",
  "description": "Run temperature ramp test",
  "testType": "Thermal Testing",
  "inCharging": ["m001"],
  "dueDate": "2025-04-22T00:00:00.000Z",
  "status": "pending"
}

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "id": "t002",
  "name": "Temp Ramp Test",
  "description": "Run temperature ramp test",
  "testType": "Thermal Testing",
  "inCharging": ["m001"],
  "timestamps": "2025-04-17T15:00:00.000Z",
  "updatedAt": "2025-04-17T14:44:06.019Z",
  "dueDate": "2025-04-22T00:00:00.000Z",
  "status": "pending"
}
```

##### PUT /v1/tasks/:id:
* 功能描述: 修改特定 task (full update)。
* INPUT: Header 帶入 accessToken，Body JSON 含 name、description、testType、inCharging、dueDate、status。
* OUTPUT: 修改後的 task 資料。
* Http Code:
    * 200 OK
    * 400 Bad Request: "Invalid status"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken" / "Insufficient permissions"
    * 404 Not Found: "Task not found"
```
PUT http://localhost:8888/api/v1/tasks/t001
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Temp Ramp Test V2",
  "description": "Updated procedure",
  "testType": "Thermal Testing",
  "inCharging": ["m001","m003"],
  "dueDate": "2025-04-23T00:00:00.000Z",
  "status": "in-progress"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id": "t001",
  "name": "Temp Ramp Test V2",
  "description": "Updated procedure",
  "testType": "Thermal Testing",
  "inCharging": ["m001","m003"],
  "timestamps": "2025-04-17T14:10:00.000Z",
  "updatedAt": "2025-04-17T14:44:06.019Z",
  "dueDate": "2025-04-23T00:00:00.000Z",
  "status": "in-progress"
}
```

##### PUT /v1/tasks/:id/:attribute:
* 功能描述: 更新 task 的單一屬性。
* INPUT: Header 帶入 accessToken，Body JSON 含該 attribute 的新值。
* OUTPUT: 修改後的屬性資料。
* Http Code:
    * 200 OK
    * 400 Bad Request: "Invalid attribute" / "Invalid value"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken" / "Insufficient permissions"
    * 404 Not Found: "Task not found"
```
PUT http://localhost:8888/api/v1/tasks/t001/status
Authorization: Bearer {accessToken}
Content-Type: application/json

{ "status": "completed" }

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "id": "t001", "status": "completed" }
```

##### DELETE /v1/tasks/:id:
* 功能描述: 刪除特定 task。
* INPUT: 把 accessToken 放在 Header 裡頭送過來。
* OUTPUT: 刪除回應訊息。
* Http Code:
    * 200 OK
    * 400 Bad Request: "Task not found"
    * 401 Unauthorized: "no accessToken in Header"
    * 403 Forbidden: "Invalid accessToken" / "Insufficient permissions"
```
DELETE http://localhost:8888/api/v1/tasks/t002
Authorization: Bearer {accessToken}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "message": "Task deleted successfully" }
```
