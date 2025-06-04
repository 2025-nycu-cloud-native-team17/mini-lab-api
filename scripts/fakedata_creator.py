import random
import json

test_types = ["Thermal Testing", "Electrical Testing", "Physical Property Testing"]
status = ["pending"]
durations = [1800, 3600, 5400, 7200]  # 30, 60, 90, 120 minutes in seconds
deadlines = [18000, 27000, 36000, 72000, 86400*2, 86400*3, 86400*4, 86400*5]

if __name__ == "__main__":
    """
      {
        name: "Thermal Test A",
        description: "Thermal test for component A",
        testType: "Thermal Testing",
        inCharging: ["E002", "M001"],
        status: "assigned",
        duration: 1800,                          // 30 minutes
        earliest_start: now + 0,                // 09:00
        deadline: now + 7200                    // 11:00
      },
    """
    data = []
    hassh = {}
    for i in range(1, 51):
        testType = random.choice(test_types)
        
        if testType not in hassh.keys():
            hassh[testType] = 1
        else:
            hassh[testType] += 1
        cnt = hassh[testType]
        
        entry = {
            "name": f"{testType} {cnt}",
            "description": f"Auto-generated description for test {i}",
            "testType": testType,
            "inCharging": [],
            "status": "pending",
            "duration": random.choice(durations),
            "earliest_start": "now + 0",
            "deadline": f"now + {random.choice(deadlines)}"
        }
        data.append(entry)
    print(json.dumps(data, indent=2))

