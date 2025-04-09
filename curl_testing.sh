

# 之後會刪掉這個檔案, 暫時存一些測試指令


# login and get token
curl -X POST "http://localhost:8888/api/v1/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Get all machines
curl -X GET "http://localhost:8888/api/v1/machines" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M"

# Add a machine
curl -X POST "http://localhost:8888/api/v1/machines" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M" \
  -d '{
    "name": "Thermal machine",
    "description": "This is a thermal machine",
    "testType": "Thermal test",
    "status": "idle",
    "count": 1
  }'

# Modify a machine 
curl -X PUT "http://localhost:8888/api/v1/machines/67f671c798766b5075727642" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M" \
  -d '{
      "name": "Thermal machine",
      "description": "This is a thermal machine",
      "testType": "Thermal test",
      "status": "idle",
      "count": 10
  }'

# Modify a sepcific field of a machine
curl -X PUT "http://localhost:8888/api/v1/machines/67f671c798766b5075727642/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M" \
  -d '{
      "value": "in_progress"
  }'

# Delete a machine by id
curl -X DELETE "http://localhost:8888/api/v1/machines/67f6729598766b5075727646" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M"


# Get all tasks
curl -X GET "http://localhost:8888/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M"

# Add a tasks
curl -X POST "http://localhost:8888/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M" \
  -d '{
    "name": "Thermal task",
    "description": "This is a thermal task",
    "testType": "Thermal test",
    "status": "pending",
    "inCharging": ["User1", "User2"]
  }'

# Modify a task
curl -X PUT "http://localhost:8888/api/v1/tasks/67f6743598766b5075727654" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M" \
  -d '{
    "name": "Thermal task",
    "description": "This is a thermal task WWWWWWWWWWWWWW",
    "testType": "Thermal test",
    "status": "pending",
    "inCharging": ["User1"]
  }'

# Modify a sepcific field of a task 
curl -X PUT "http://localhost:8888/api/v1/tasks/67f6743598766b5075727654/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M" \
  -d '{
      "value": "pending"
  }'

# Delete a task by id
curl -X DELETE "http://localhost:8888/api/v1/tasks/67f6743598766b5075727654" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzQ0MjA0MjE1LCJleHAiOjE3NDQyMDc4MTV9.KQUKvm_yXAIPvBGIwQIDEVPTkIspDlKzNqhh0XUva6M"

