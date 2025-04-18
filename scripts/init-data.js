// Modify this in your develop environment if you need;
db = db.getSiblingDB('myMernApp');
db.MiniLabUsers.insertMany([
    {userId:"0001", name: "user1", email: "user1@example.com", password:"user1", role: "manager", testType: "Physical Property Testing", inCharging: [], status: "active", refreshToken: ""},
    {userId:"0002", name: "user2", email: "user2@example.com", password:"user2", role: "leader", testType: "Thermal Testing", inCharging: ["Task1", "Task2"], status: "active", refreshToken: ""},
    {userId:"0003", name: "user3", email: "user3@example.com", password:"user3", role: "member", testType: "Electrical Testing", inCharging: ["Task1", "Task2"], status: "active", refreshToken: ""},
]);

db.MiniLabMachines.insertMany([
    {name: "Machine1", description:"Thermal Testing", count: 3, status: "available", testType: "Thermal Testing"},
    {name: "Machine2", description:"Electrical Testing", count: 4, status: "available", testType: "Electrical Testing"},
    {name: "Machine3", description:"Physical Property Testing", count: 5, status: "available", testType: "Physical Property Testing"},
]);

db.MiniLabTasks.insertMany([
    {name: "Task1", description: "Thermal Test Task", testType: "Thermal Testing", inCharging: ["user2"], status: "pending",  timestamps : "2025-04-17T14:10:00.000Z", dueDate: "2025-04-20T00:00:00.000Z" },
    {name: "Task2", description: "Electrical Test Task", testType: "Electrical Testing", inCharging: ["user3"], status: "in progress",  timestamps: "2025-04-17T14:10:00.000Z", dueDate: "2025-04-20T00:00:00.000Z" },
    {name: "Task3", description: "Physical Property Test Task", testType: "Physical Property Testing", inCharging: ["user1"], status: "completed",  timestamps: "2025-04-17T14:10:00.000Z", dueDate: "2025-04-20T00:00:00.000Z"},
]);
