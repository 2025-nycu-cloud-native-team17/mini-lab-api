from typing import List, Dict, Tuple
import heapq
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import matplotlib.colors as mcolors
from functools import lru_cache


from typing import List, Tuple

# TODO: rewrite into typescript


class Task:
    def __init__(self, task_id: int, task_type: str, duration: int):
        self.task_id = task_id
        self.task_type = task_type
        self.duration = duration
        self.start_time
        self.deadline
        # no self.dependencies


class Employee:
    def __init__(self, employee_id: int, capable_types: List[str]):
        self.employee_id = employee_id
        self.capable_types = capable_types
        self.available_time = 0


class Machine:
    def __init__(self, machine_id: int, capable_types: List[str]):
        self.machine_id = machine_id
        self.capable_types = capable_types
        self.available_time = 0


def versatility(entity, task_type):
    return sum(task_type in e.capable_types for e in entity)


def assign_tasks(
    tasks: List[Task], employees: List[Employee], machines: List[Machine]
) -> List[Tuple[int, int, int, int]]:
    assignments = []
    tasks = sorted(tasks, key=lambda t: -t.duration)  # prioritize long tasks

    for task in tasks:
        # eligible_emps = [e for e in employees if task.task_type in e.capable_types]
        # eligible_macs = [m for m in machines if task.task_type in m.capable_types]
        eligible_emps = sorted(
            [e for e in employees if task.task_type in e.capable_types],
            key=lambda e: (e.available_time, versatility(employees, task.task_type)),
        )
        eligible_macs = sorted(
            [m for m in machines if task.task_type in m.capable_types],
            key=lambda m: (m.available_time, versatility(machines, task.task_type)),
        )

        if not eligible_emps:
            raise ValueError(f"No employee for task {task.task_id} ({task.task_type})")
        if not eligible_macs:
            raise ValueError(f"No machine for task {task.task_id} ({task.task_type})")

        best_assignment = None
        earliest_finish = float("inf")

        for e in eligible_emps:
            for m in eligible_macs:
                start = max(e.available_time, m.available_time)
                finish = start + task.duration
                if finish < earliest_finish:
                    earliest_finish = finish
                    best_assignment = (task.task_id, e, m, start)

        task_id, emp, mac, start_time = best_assignment
        emp.available_time = mac.available_time = start_time + task.duration
        assignments.append((task_id, emp.employee_id, mac.machine_id, start_time))

    return assignments


def assign_tasks_dp(tasks, employees, machines):
    task_n = len(tasks)

    @lru_cache(maxsize=None)
    def dfs(t_idx, emp_times, mac_times):
        if t_idx == task_n:
            return 0, []

        task = tasks[t_idx]
        best_time = float("inf")
        best_plan = None

        for ei, e in enumerate(employees):
            if task.task_type not in e.capable_types:
                continue
            for mi, m in enumerate(machines):
                if task.task_type not in m.capable_types:
                    continue

                start = max(emp_times[ei], mac_times[mi])
                end = start + task.duration

                new_emp_times = list(emp_times)
                new_mac_times = list(mac_times)
                new_emp_times[ei] = end
                new_mac_times[mi] = end

                total_time, plan = dfs(
                    t_idx + 1, tuple(new_emp_times), tuple(new_mac_times)
                )
                total_time = max(total_time, end)

                if total_time < best_time:
                    best_time = total_time
                    best_plan = [
                        (task.task_id, e.employee_id, m.machine_id, start)
                    ] + plan

        return best_time, best_plan

    initial_emp = tuple(0 for _ in employees)
    initial_mac = tuple(0 for _ in machines)
    _, assignment = dfs(0, initial_emp, initial_mac)
    return assignment


def lighten_color(color, amount=0.5):
    r, g, b, a = color
    white = (1.0, 1.0, 1.0)
    return tuple((1 - amount) * c + amount * w for c, w in zip((r, g, b), white)) + (a,)


def draw_gantt(assignments: List[Tuple[int, int, int, int]], tasks: List[Task]):
    task_lookup = {t.task_id: t for t in tasks}
    emp_ids = sorted(set(eid for _, eid, _, _ in assignments))
    mac_ids = sorted(set(mid for _, _, mid, _ in assignments))

    emp_pos = {eid: i for i, eid in enumerate(emp_ids)}
    mac_pos = {mid: i + len(emp_ids) + 1 for i, mid in enumerate(mac_ids)}

    # Prepare colormap
    task_ids = sorted(task_lookup.keys())
    norm = mcolors.Normalize(vmin=min(task_ids), vmax=max(task_ids))
    cmap = cm.get_cmap("jet")

    fig, ax = plt.subplots(figsize=(12, 6))

    for task_id, emp_id, mac_id, start_time in assignments:
        duration = task_lookup[task_id].duration
        color = lighten_color(
            cmap(norm(task_id)), amount=0.5
        )  # 0.5 = 50% blended with white

        # Employee bar
        y_emp = emp_pos[emp_id]
        ax.barh(y_emp, duration, left=start_time, height=0.4, color=color)
        ax.text(
            start_time + duration / 2,
            y_emp,
            f"T{task_id}",
            ha="center",
            va="center",
            color="black",
        )

        # Machine bar
        y_mac = mac_pos[mac_id]
        ax.barh(y_mac, duration, left=start_time, height=0.4, color=color)
        ax.text(
            start_time + duration / 2,
            y_mac,
            f"T{task_id}",
            ha="center",
            va="center",
            color="black",
        )

    yticks = list(emp_pos.values()) + list(mac_pos.values())
    ylabels = [f"Emp {eid}" for eid in emp_ids] + [f"Mac {mid}" for mid in mac_ids]

    ax.set_yticks(yticks)
    ax.set_yticklabels(ylabels)
    ax.set_xlabel("Time")
    ax.set_title("Task Assignments to Employees and Machines (Jet Colors)")
    plt.tight_layout()
    plt.show()


# Test case
if __name__ == "__main__":
    tasks = [
        Task(1, "A", 4),
        Task(2, "B", 3),
        Task(3, "C", 5),
        Task(4, "D", 2),
        Task(5, "E", 6),
        Task(6, "F", 3),
        Task(7, "G", 4),
        Task(8, "H", 2),
        Task(9, "A", 5),
        Task(10, "B", 1),
        Task(11, "C", 4),
        Task(12, "D", 3),
        Task(13, "E", 2),
        Task(14, "F", 6),
        Task(15, "G", 3),
        Task(16, "H", 4),
    ]

    employees = [
        Employee(101, ["A"]),
        Employee(102, ["C"]),
        Employee(103, ["E", "H"]),
        Employee(104, ["G"]),
        Employee(105, ["B"]),
        Employee(106, ["D", "F"]),
    ]

    machines = [
        Machine(201, ["A"]),
        Machine(202, ["C", "F", "H", "D"]),
        Machine(203, ["E"]),
        Machine(204, ["G"]),
        Machine(205, ["B"]),
    ]

    result = assign_tasks_dp(tasks, employees, machines)
    for tid, eid, mid, start in result:
        print(
            f"Task {tid} assigned to Employee {eid} and Machine {mid} at time {start}"
        )
    draw_gantt(result, tasks)
