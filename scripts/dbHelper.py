
import argparse 
import pymongo, yaml

def get_args():
    parser = argparse.ArgumentParser(description="Insert data into the database")
    parser.add_argument("--file", type=str, help="Path to the YAML file containing data", required=True)
    parser.add_argument("--table",  type=str, help="Name of the table to insert data into", required=True, choices=["MiniLabUsers", "MiniLabMachines", "MiniLabTasks"])  
    parser.add_argument("--action", type=str, help="Action to perform on the data", required=True, choices=["show", "insert", "update", "delete", "delete_table"])
    
    # Have default values.
    parser.add_argument("--db", type=str, help="Name of the database to connect to", default="myMernApp")
    parser.add_argument("--host", type=str, help="Host of the database", default="localhost")
    parser.add_argument("--port", type=int, help="Port of the database", default=27017)
    return parser.parse_args()

class DbHelper:
    def __init__(self, db_name, host, port):
        self.client = pymongo.MongoClient(host, port)
        self.db = self.client[db_name]

    def insert_data(self, table_name, data):
        collection = self.db[table_name]
        collection.insert_many(data)

    def update_data(self, table_name, query, new_values):
        collection = self.db[table_name]
        collection.update_many(query, new_values)

    def delete_data(self, table_name, query):
        collection = self.db[table_name]
        collection.delete_many(query)
        
    def delete_table(self, table_name):
        collection = self.db[table_name]
        collection.drop()
    
    def show_data(self, table_name):
        print(f"Datas from {args.table} table:")
        collection = self.db[table_name]
        for rec in collection.find():
            print(rec)


# File examples:

# User
# fields: {
#   name: String, email: String, password: String, 
#   role: String in [leader, member], testType: String, inCharging: [String], 
#   status: in [active, inactive, blocked, deleted, pending], refreshToken: String
# }
""" 
# Example for insertion:
- name: "User One"
  email: "user1@example.com" #### MUST UNIQUE
  password: "hashed_password_1"
  role: "leader"
  testType: "TypeA"
  inCharging: ["Task1", "Task2"]
  status: "active"
  refreshToken: "token1"
- name: "User Two"
  email: "user2@example.com"
  password: "hashed_password_2"
  role: "member"
  testType: "TypeB"
  inCharging: []
  status: "pending"
  refreshToken: "token2"

# Example for update:
query:
  name: "User One"
new_values:
  $set:
    status: "inactive"
    inCharging: ["Task3"]

# Example for deletion:
query:
  email: "user2@example.com"
"""

# Machine
# fields: {name: String, description: String, testType: String, count: Number, 
# status: String in [idle, in_progress, completed]
# }
"""
# Example for insertion:
- name: "Machine A"
  description: "Primary testing machine"
  testType: "TypeA"
  count: 10
  status: "idle"
- name: "Machine B"
  description: "Secondary testing machine"
  testType: "TypeB"
  count: 5
  status: "in_progress"

# Example for update:
query:
  name: "Machine B"
new_values:
  $set:
    status: "completed"
    count: 0

# Example for deletion:
query:
  status: "idle"
"""
# TASK
# fields: {name: String, description: String, testType: String, inCharging: [String],
# status: String in [pending, in_progress, completed]
# }
"""
# Example for insertion:
- name: "Task Alpha"
  description: "Initial setup task"
  testType: "TypeA"
  inCharging: ["User One"]
  status: "pending"
- name: "Task Beta"
  description: "Data processing task"
  testType: "TypeB"
  inCharging: ["User Two"]
  status: "in_progress"

# Example for update:
query:
  name: "Task Alpha"
new_values:
  $set:
    status: "completed"
    inCharging: []

# Example for deletion:
query:
  testType: "TypeB"
"""

""" 使用方式:
假設建立一個 data.yaml, 如果想要 insert:

Insert:
1. 在 data.yaml 裡面寫入資料 (可以 Copy 上面的範例, 僅需貼上 insertion 的部分)
2. python dbHelper.py --file data.yaml --table MiniLabUsers --action insert

Update, Delection 同理.

Show: 
1. python dbHelper.py --table MiniLabUsers --action show
"""
if __name__ == "__main__":
    args = get_args()
    
    dbHelper = DbHelper(args.db, args.host, args.port)

    print(args.table)

    if args.action == "show":
        dbHelper.show_data(args.table)
        exit(0)
    elif args.action == "delete_table":
        dbHelper.delete_table(args.table)
        exit(0)
        
    with open(f"{args.file}", "r") as stream:
        data = yaml.safe_load(open(f"{args.file}", "r"))
        
        if args.action == "insert":
            dbHelper.insert_data(args.table, data)
        elif args.action == "update":
            dbHelper.update_data(args.table, data["query"], data["new_values"])
        else:
            dbHelper.delete_data(args.table, data["query"])
                    
    print(f"Data {args.action}ed successfully in {args.table} table.")