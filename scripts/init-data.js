// Switch to the correct DB
db = db.getSiblingDB('myMernApp');
const now = Math.floor(new Date("2025-06-23T09:00:00Z").getTime() / 1000); // UTC timestamp

db.MiniLabUsers.insertMany([
  {
    userId: "0001",
    name: "user1",
    email: "user1@example.com",
    password: "user1",
    role: "manager",
    testType: ["Physical Property Testing"],
    inCharging: [],
    status: "active",
    refreshToken: "",
    busywindow: [[now + 0, now + 1800]] // 09:00 ~ 09:30
  },
  {
    userId: "0002",
    name: "user2",
    email: "user2@example.com",
    password: "user2",
    role: "leader",
    testType: ["Thermal Testing"],
    inCharging: ["T001"],
    status: "active",
    refreshToken: "",
    busywindow: [[now + 3600, now + 5400]] // 10:00 ~ 10:30
  },
  {
    userId: "0003",
    name: "user3",
    email: "user3@example.com",
    password: "user3",
    role: "member",
    testType: ["Electrical Testing"],
    inCharging: ["T002"],
    status: "active",
    refreshToken: "",
    busywindow: []
  }
]);

db.MiniLabMachines.insertMany([
  {
    machineId: "M001",
    name: "Machine1",
    description: "Thermal Testing",
    testType: ["Thermal Testing"],
    count: 3,
    status: "available",
    busywindow: [[now + 1800, now + 2700]] // 09:30 ~ 09:45
  },
  {
    machineId: "M002",
    name: "Machine2",
    description: "Electrical Testing",
    testType: ["Electrical Testing"],
    count: 4,
    status: "available",
    busywindow: []
  },
  {
    machineId: "M003",
    name: "Machine3",
    description: "Physical Property Testing",
    testType: ["Physical Property Testing"],
    count: 5,
    status: "available",
    busywindow: []
  }
]);

db.MiniLabTasks.insertMany([
  {
    taskId: "T001",
    name: "Thermal Test A",
    description: "Thermal test for component A",
    testType: "Thermal Testing",
    inCharging: ["0002"],
    status: "pending",
    duration: 1800,                          // 30 minutes
    earliest_start: now + 0,                // 09:00
    deadline: now + 7200                    // 11:00
  },
  {
    taskId: "T002",
    name: "Electrical Test B",
    description: "Voltage tolerance test",
    testType: "Electrical Testing",
    inCharging: ["0003"],
    status: "pending",
    duration: 3600,
    earliest_start: now + 1800,             // 09:30
    deadline: now + 10800                   // 12:00
  },
  {
    taskId: "T003",
    name: "Property Test C",
    description: "Stress test on plastics",
    testType: "Physical Property Testing",
    inCharging: ["0001"],
    status: "pending",
    duration: 1800,
    earliest_start: now + 7200,             // 11:00
    deadline: now + 9000                    // 11:30
  }
]);

db.MiniLabAssignments.insertMany([
  {
    task_id: "T001",
    worker_id: "0002",
    machine_id: "M001",
    start: now + 0,        // 09:00
    end: now + 1800        // 09:30
  },
  {
    task_id: "T002",
    worker_id: "0003",
    machine_id: "M002",
    start: now + 1800,     // 09:30
    end: now + 5400        // 10:30
  },
  {
    task_id: "T003",
    worker_id: "0001",
    machine_id: "M003",
    start: now + 7200,     // 11:00
    end: now + 9000        // 11:30
  }
]);

