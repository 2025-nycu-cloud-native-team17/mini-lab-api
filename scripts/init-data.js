// Switch to the correct DB
db = db.getSiblingDB('myMernApp');
const now = Math.floor(new Date("2025-06-23T09:00:00Z").getTime() / 1000); // UTC timestamp

db.MiniLabUsers.insertMany([
  {
    userId: "E001",
    name: "user1",
    email: "user1@example.com",
    password: "user1",
    role: "manager",
    testType: ["Physical Property Testing"],
    inCharging: ["T003"],
    status: "active",
    refreshToken: "",
    busywindow: [[now + 0, now + 1800]] // 09:00 ~ 09:30
  },
  {
    userId: "E002",
    name: "user2",
    email: "user2@example.com",
    password: "user2",
    role: "leader",
    testType: ["Thermal Testing"],
    status: "active",
    refreshToken: "",
    inCharging: ["T001"],
    busywindow: [[now, now + 1800]]
  },
  {
    userId: "E003",
    name: "user3",
    email: "user3@example.com",
    password: "user3",
    role: "member",
    testType: ["Electrical Testing"],
    status: "active",
    refreshToken: "",
    inCharging: ["T002"],
    busywindow: [[now + 1800, now + 5400]]
  }
]);

db.MiniLabMachines.insertMany([
  {
    machineId: "M001",
    name: "Machine1",
    description: "",
    testType: ["Thermal Testing"],
    count: 1,
    status: "idle",
    inCharging: ["T001"],
    busywindow: [[now, now + 1800]]
  },
  {
    machineId: "M002",
    name: "Machine2",
    description: "",
    testType: ["Electrical Testing"],
    count: 1,
    status: "idle",
    inCharging: ["T002"],
    busywindow: [[now + 1800, now + 5400]]
  },
  {
    machineId: "M003",
    name: "Machine3",
    description: "",
    testType: ["Physical Property Testing"],
    count: 1,
    status: "idle",
    inCharging: ["T003"],
    busywindow: [[now + 7200, now + 9000]]
  }
]);

db.MiniLabTasks.insertMany([
  {
    taskId: "T001",
    name: "Thermal Test A",
    description: "Thermal test for component A",
    testType: "Thermal Testing",
    inCharging: ["E002", "M001"],
    status: "assigned",
    duration: 1800,                          // 30 minutes
    earliest_start: now + 0,                // 09:00
    deadline: now + 7200                    // 11:00
  },
  {
    taskId: "T002",
    name: "Electrical Test B",
    description: "Voltage tolerance test",
    testType: "Electrical Testing",
    inCharging: ["E003", "M002"],
    status: "assigned",
    duration: 3600,
    earliest_start: now + 1800,             // 09:30
    deadline: now + 10800                   // 12:00
  },
  {
    taskId: "T003",
    name: "Property Test C",
    description: "Stress test on plastics",
    testType: "Physical Property Testing",
    inCharging: ["E001", "M003"],
    status: "assigned",
    duration: 1800,
    earliest_start: now + 7200,             // 11:00
    deadline: now + 9000                    // 11:30
  }
]);

db.MiniLabAssignments.insertMany([
  {
    task_id: "T001",
    worker_id: "E002",
    machine_id: "M001",
    start: now + 0,        // 09:00
    end: now + 1800        // 09:30
  },
  {
    task_id: "T002",
    worker_id: "E003",
    machine_id: "M002",
    start: now + 1800,     // 09:30
    end: now + 5400        // 10:30
  },
  {
    task_id: "T003",
    worker_id: "E001",
    machine_id: "M003",
    start: now + 7200,     // 11:00
    end: now + 9000        // 11:30
  }
]);

