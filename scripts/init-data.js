// Switch to the correct DB
db = db.getSiblingDB('myMernApp');
const now = Math.floor(Date.now() / 1000) // 取得當下本地時間（依系統時區）
// const now = 0;

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
  },
  {
    userId: "E004",
    name: "user4",
    email: "user4@example.com",
    password: "user4",
    role: "member",
    testType: ["Physical Property Testing"],
    status: "active",
    refreshToken: "",
    inCharging: [],
    busywindow: []
  },
  {
    userId: "E005",
    name: "user5",
    email: "user5@example.com",
    password: "user5",
    role: "member",
    testType: ["Thermal Testing"],
    status: "active",
    refreshToken: "",
    inCharging: [],
    busywindow: []
  },
  {
    userId: "E006",
    name: "user6",
    email: "user6@example.com",
    password: "user6",
    role: "member",
    testType: ["Electrical Testing", "Thermal Testing"],
    status: "active",
    refreshToken: "",
    inCharging: [],
    busywindow: []
  },
  {
    userId: "E007",
    name: "user7",
    email: "user7@example.com",
    password: "user7",
    role: "member",
    testType: ["Electrical Testing", "Thermal Testing"],
    status: "active",
    refreshToken: "",
    inCharging: [],
    busywindow: []
  },
  {
    userId: "E008",
    name: "user8",
    email: "user8@example.com",
    password: "user8",
    role: "member",
    testType: ["Electrical Testing", "Thermal Testing"],
    status: "active",
    refreshToken: "",
    inCharging: [],
    busywindow: []
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
    testType: ["Physical Property Testing", "Thermal Testing", "Electrical Testing"],
    count: 1,
    status: "idle",
    inCharging: ["T003"],
    busywindow: [[now + 7200, now + 9000]]
  },
  {
    machineId: "M004",
    name: "Machine4",
    description: "",
    testType: ["Physical Property Testing", "Thermal Testing", "Electrical Testing"],
    count: 1,
    status: "idle",
    inCharging: [],
    busywindow: []
  },
  {
    machineId: "M005",
    name: "Machine5",
    description: "",
    testType: ["Physical Property Testing", "Thermal Testing", "Electrical Testing"],
    count: 1,
    status: "idle",
    inCharging: [],
    busywindow: []
  },
  {
    machineId: "M006",
    name: "Machine6",
    description: "",
    testType: ["Physical Property Testing", "Thermal Testing", "Electrical Testing"],
    count: 1,
    status: "idle",
    inCharging: [],
    busywindow: []
  },
  {
    machineId: "M007",
    name: "Machine7",
    description: "",
    testType: ["Physical Property Testing", "Thermal Testing", "Electrical Testing"],
    count: 1,
    status: "idle",
    inCharging: [],
    busywindow: []
  },
  {
    machineId: "M008",
    name: "Machine8",
    description: "",
    testType: ["Physical Property Testing", "Thermal Testing", "Electrical Testing"],
    count: 1,
    status: "idle",
    inCharging: [],
    busywindow: []
  }

]);

db.MiniLabTasks.insertMany([
  {
    // taskId: "3001",
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
    // taskId: "3002",
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
    // taskId: "3003",
    name: "Property Test C",
    description: "Stress test on plastics",
    testType: "Physical Property Testing",
    inCharging: ["E001", "M003"],
    status: "assigned",
    duration: 1800,
    earliest_start: now + 7200,             // 11:00
    deadline: now + 9000                    // 11:30
  },
  {
    // taskId: "3004",
    name: "Thermal Test B",
    description: "Thermal test for component B",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 1800,             // 09:30
    deadline: now + 10800                   // 12:00
  },
  {
    // taskId: "3005",
    name: "Electrical Test B",
    description: "Voltage tolerance test",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 1800,             // 09:30
    deadline: now + 10800                   // 12:00
  },
  {
    name: "Thermal Testing 1",
    description: "Auto-generated description for test 1",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 432000
  },
  {
    name: "Physical Property Testing 1",
    description: "Auto-generated description for test 2",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 27000
  },
  {
    name: "Thermal Testing 2",
    description: "Auto-generated description for test 3",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 72000
  },
  {
    name: "Thermal Testing 3",
    description: "Auto-generated description for test 4",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 36000
  },
  {
    name: "Physical Property Testing 2",
    description: "Auto-generated description for test 5",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 18000
  },
  {
    name: "Thermal Testing 4",
    description: "Auto-generated description for test 6",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Thermal Testing 5",
    description: "Auto-generated description for test 7",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 432000
  },
  {
    name: "Electrical Testing 1",
    description: "Auto-generated description for test 8",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 18000
  },
  {
    name: "Physical Property Testing 3",
    description: "Auto-generated description for test 9",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 432000
  },
  {
    name: "Physical Property Testing 4",
    description: "Auto-generated description for test 10",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 345600
  },
  {
    name: "Physical Property Testing 5",
    description: "Auto-generated description for test 11",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 18000
  },
  {
    name: "Physical Property Testing 6",
    description: "Auto-generated description for test 12",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 36000
  },
  {
    name: "Thermal Testing 6",
    description: "Auto-generated description for test 13",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 36000
  },
  {
    name: "Physical Property Testing 7",
    description: "Auto-generated description for test 14",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 27000
  },
  {
    name: "Electrical Testing 2",
    description: "Auto-generated description for test 15",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 345600
  },
  {
    name: "Physical Property Testing 8",
    description: "Auto-generated description for test 16",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 27000
  },
  {
    name: "Electrical Testing 3",
    description: "Auto-generated description for test 17",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 345600
  },
  {
    name: "Thermal Testing 7",
    description: "Auto-generated description for test 18",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 72000
  },
  {
    name: "Electrical Testing 4",
    description: "Auto-generated description for test 19",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 27000
  },
  {
    name: "Electrical Testing 5",
    description: "Auto-generated description for test 20",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 259200
  },
  {
    name: "Thermal Testing 8",
    description: "Auto-generated description for test 21",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 259200
  },
  {
    name: "Thermal Testing 9",
    description: "Auto-generated description for test 22",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 36000
  },
  {
    name: "Physical Property Testing 9",
    description: "Auto-generated description for test 23",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 345600
  },
  {
    name: "Thermal Testing 10",
    description: "Auto-generated description for test 24",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 27000
  },
  {
    name: "Physical Property Testing 10",
    description: "Auto-generated description for test 25",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 345600
  },
  {
    name: "Physical Property Testing 11",
    description: "Auto-generated description for test 26",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Electrical Testing 6",
    description: "Auto-generated description for test 27",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 36000
  },
  {
    name: "Physical Property Testing 12",
    description: "Auto-generated description for test 28",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 18000
  },
  {
    name: "Thermal Testing 11",
    description: "Auto-generated description for test 29",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 345600
  },
  {
    name: "Physical Property Testing 13",
    description: "Auto-generated description for test 30",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 432000
  },
  {
    name: "Physical Property Testing 14",
    description: "Auto-generated description for test 31",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 18000
  },
  {
    name: "Physical Property Testing 15",
    description: "Auto-generated description for test 32",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Thermal Testing 12",
    description: "Auto-generated description for test 33",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 27000
  },
  {
    name: "Thermal Testing 13",
    description: "Auto-generated description for test 34",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 18000
  },
  {
    name: "Physical Property Testing 16",
    description: "Auto-generated description for test 35",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 432000
  },
  {
    name: "Physical Property Testing 17",
    description: "Auto-generated description for test 36",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Thermal Testing 14",
    description: "Auto-generated description for test 37",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Electrical Testing 7",
    description: "Auto-generated description for test 38",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 27000
  },
  {
    name: "Thermal Testing 15",
    description: "Auto-generated description for test 39",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 72000
  },
  {
    name: "Physical Property Testing 18",
    description: "Auto-generated description for test 40",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Thermal Testing 16",
    description: "Auto-generated description for test 41",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Physical Property Testing 19",
    description: "Auto-generated description for test 42",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Physical Property Testing 20",
    description: "Auto-generated description for test 43",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 72000
  },
  {
    name: "Physical Property Testing 21",
    description: "Auto-generated description for test 44",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 72000
  },
  {
    name: "Electrical Testing 8",
    description: "Auto-generated description for test 45",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 432000
  },
  {
    name: "Physical Property Testing 22",
    description: "Auto-generated description for test 46",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 5400,
    earliest_start: now + 0,
    deadline: now + 259200
  },
  {
    name: "Electrical Testing 9",
    description: "Auto-generated description for test 47",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 3600,
    earliest_start: now + 0,
    deadline: now + 259200
  },
  {
    name: "Thermal Testing 17",
    description: "Auto-generated description for test 48",
    testType: "Thermal Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 172800
  },
  {
    name: "Electrical Testing 10",
    description: "Auto-generated description for test 49",
    testType: "Electrical Testing",
    inCharging: [],
    status: "pending",
    duration: 1800,
    earliest_start: now + 0,
    deadline: now + 432000
  },
  {
    name: "Physical Property Testing 23",
    description: "Auto-generated description for test 50",
    testType: "Physical Property Testing",
    inCharging: [],
    status: "pending",
    duration: 7200,
    earliest_start: now + 0,
    deadline: now + 27000
  }
]);

db.MiniLabAssignments.insertMany([
  {
    task_id: "T001",
    task_name: "Thermal Test A",
    worker_id: "E002",
    machine_id: "M001",
    start: now + 0,        // 09:00
    end: now + 1800        // 09:30
  },
  {
    task_id: "T002",
    task_name: "Electrical Test B",
    worker_id: "E003",
    machine_id: "M002",
    start: now + 1800,     // 09:30
    end: now + 5400        // 10:30
  },
  {
    task_id: "T003",
    task_name: "Property Test C",
    worker_id: "E001",
    machine_id: "M003",
    start: now + 7200,     // 11:00
    end: now + 9000        // 11:30
  }
]);
