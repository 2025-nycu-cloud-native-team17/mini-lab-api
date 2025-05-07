/*
Input: 
可被排程的測試員, 擅長的測試元件。
可被排程的測試機器, 只有一個測試元件。 
需要被排程的測試工作, deadline, duration

Output: 
最佳化目標是排程出最多可被完成的工作
*/


import * as mini_lab_type from "../types/mini_lab"

// 定義全域變數儲存 job, testers, machines 的狀態，之後會從資料庫抓取。
let jobs: { [taskId: string]: mini_lab_type.Task } = {};
let testers: { [testerId: string]: mini_lab_type.User } = {};
let machines: { [machineId: string]: mini_lab_type.Machine } = {};

// --- Mock Data ---
const mock_tasks_data = [
    {id: '1', name: 'Task 1', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 3},
    {id: '2', name: 'Task 2', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 3},
    {id: '3', name: 'Task 3', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 3},
    {id: '4', name: 'Task 4', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 3},
    {id: '5', name: 'Task 5', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 3},
    {id: '6', name: 'Task 6', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 2}, // Assuming TEST3 corresponds to 'Physical'/'water'
    {id: '7', name: 'Task 7', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 2},
    {id: '8', name: 'Task 8', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 2},
    {id: '9', name: 'Task 9', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 2},
    {id: '10', name: 'Task 10', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 2},
    {id: '11', name: 'Task 11', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 1}, // Assuming TEST2 corresponds to 'Electrical'/'electronic'
    {id: '12', name: 'Task 12', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 1},
    {id: '13', name: 'Task 13', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 1},
    {id: '14', name: 'Task 14', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 1},
    {id: '15', name: 'Task 15', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 1},
    {id: '16', name: 'Task 16', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 5},
    {id: '17', name: 'Task 17', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 5},
    {id: '18', name: 'Task 18', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 5},
    {id: '19', name: 'Task 19', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 5},
    {id: '20', name: 'Task 20', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 5},
    {id: '21', name: 'Task 21', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 4},
    {id: '22', name: 'Task 22', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 3},
    {id: '23', name: 'Task 23', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 2},
    {id: '24', name: 'Task 24', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 5},
    {id: '25', name: 'Task 25', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 6},
    {id: '26', name: 'Task 26', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 7},
    {id: '27', name: 'Task 27', description: '', testType: mini_lab_type.UserTestType.TEST3, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 2},
    {id: '28', name: 'Task 28', description: '', testType: mini_lab_type.UserTestType.TEST2, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 5},
    {id: '29', name: 'Task 29', description: '', testType: mini_lab_type.UserTestType.TEST1, inCharging: [], createAt: new Date(), dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: mini_lab_type.TaskStatus.PENDING, duration: 6},
];

const mock_user_data = [
    {id: '1', userId: 'u001', name: 'Alice', email: 'alice@example.com', password: 'password', role: mini_lab_type.UserRole.MEMBER, testType: [mini_lab_type.UserTestType.TEST1], status: mini_lab_type.UserStatus.ACTIVE, inCharging: [], refreshToken: ''},
    {id: '2', userId: 'u002', name: 'Bob', email: 'bob@example.com', password: 'password', role: mini_lab_type.UserRole.MEMBER, testType: [mini_lab_type.UserTestType.TEST1, mini_lab_type.UserTestType.TEST2], status: mini_lab_type.UserStatus.ACTIVE, inCharging: [], refreshToken: ''},
    {id: '3', userId: 'u003', name: 'Charlie', email: 'charlie@example.com', password: 'password', role: mini_lab_type.UserRole.MEMBER, testType: [mini_lab_type.UserTestType.TEST1], status: mini_lab_type.UserStatus.ACTIVE, inCharging: [], refreshToken: ''},
    {id: '4', userId: 'u004', name: 'David', email: 'david@example.com', password: 'password', role: mini_lab_type.UserRole.MEMBER, testType: [mini_lab_type.UserTestType.TEST1, mini_lab_type.UserTestType.TEST3], status: mini_lab_type.UserStatus.ACTIVE, inCharging: [], refreshToken: ''},
    {id: '5', userId: 'u005', name: 'Eve', email: 'eve@example.com', password: 'password', role: mini_lab_type.UserRole.MEMBER, testType: [mini_lab_type.UserTestType.TEST2], status: mini_lab_type.UserStatus.ACTIVE, inCharging: [], refreshToken: ''}
];

const mock_machine_data = [
    {id: '1', name: 'Machine A', description: '', testType: mini_lab_type.UserTestType.TEST1, status: mini_lab_type.MachineStatus.IDLE},
    {id: '2', name: 'Machine B', description: '', testType: mini_lab_type.UserTestType.TEST3, status: mini_lab_type.MachineStatus.IDLE},
    {id: '3', name: 'Machine C', description: '', testType: mini_lab_type.UserTestType.TEST2, status: mini_lab_type.MachineStatus.IDLE},
    {id: '4', name: 'Machine D', description: '', testType: mini_lab_type.UserTestType.TEST1, status: mini_lab_type.MachineStatus.IDLE},
    {id: '5', name: 'Machine E', description: '', testType: mini_lab_type.UserTestType.TEST3, status: mini_lab_type.MachineStatus.IDLE},
    {id: '6', name: 'Machine F', description: '', testType: mini_lab_type.UserTestType.TEST2, status: mini_lab_type.MachineStatus.IDLE},
    {id: '7', name: 'Machine G', description: '', testType: mini_lab_type.UserTestType.TEST1, status: mini_lab_type.MachineStatus.IDLE},
    {id: '8', name: 'Machine H', description: '', testType: mini_lab_type.UserTestType.TEST3, status: mini_lab_type.MachineStatus.IDLE},
];
// --- End Mock Data ---


// 從資料庫抓取從今天開始後兩周的測試工作, 生成隨機排程基因, N 是 Population 數量
const init_population = (N: number): string[][] => {

    const jobIds = Object.keys(jobs);
    const population: string[][] = [];

    // Generate N random permutations (shuffles) of the job IDs
    for (let i = 0; i < N; i++) {
        const shuffled_chromosome = [...jobIds];

        // Fisher-Yates (Knuth) Shuffle algorithm
        for (let j = shuffled_chromosome.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [shuffled_chromosome[j], shuffled_chromosome[k]] = [shuffled_chromosome[k], shuffled_chromosome[j]]; // Swap elements
        }

        population.push(shuffled_chromosome);
    }

    return population;
}


// fitness function(適應度函數), 解碼排程基因, 計算適應度 (完成的工作數量)
function fitness(chromosome: string[]): number {
    const tester_free: { [testerId: string]: number } = {};
    const machine_free: { [machineId: string]: number } = {};
    // 用來追蹤測試員每日的工作時間。
    const tester_daily_hours: { [testerId: string]: { [day: number]: number } } = {};
    const current_time = Date.now();
    const HOURS_PER_DAY = 8; 

    for (const tId in testers) {
        tester_free[tId] = 0;
        tester_daily_hours[tId] = {}; 
    }
    for (const mId in machines) {
        machine_free[mId] = 0;
    }

    let completed = 0;

    for (const jobId of chromosome) {
        const job = jobs[jobId];
        if (!job || typeof job.duration !== 'number' || !(job.dueDate instanceof Date) || !job.testType) {
             console.warn(`Skipping invalid job data for ID: ${jobId}`);
             continue;
        }

        let assigned = false;
        const jobDeadlineTimestamp = job.dueDate.getTime();
        const jobDuration = job.duration;

        // 這邊採用 early first 的方式去做排程
        for (const tId in testers) {
            const tester = testers[tId];

            if (tester.testType.includes(job.testType as mini_lab_type.UserTestType)) {
                for (const mId in machines) {
                    const machine = machines[mId];
                    if (machine.testType === job.testType) {
                        const potential_start_hour = Math.max(tester_free[tId], machine_free[mId]);
                        const potential_end_hour = potential_start_hour + jobDuration;
                        const potential_completion_timestamp = current_time + potential_end_hour * 60 * 60 * 1000;

                        if (potential_completion_timestamp > jobDeadlineTimestamp) {
                            continue; 
                        }

                        // 檢查是否 tester 工作超時
                        let violates_daily_limit = false;
                        const hours_to_add_per_day: { [day: number]: number } = {};

                        const start_day = Math.floor(potential_start_hour / 24);
                        const end_day = Math.floor((potential_end_hour - 1e-6) / 24);

                        for (let day = start_day; day <= end_day; day++) {
                            const day_start_hour = day * 24;
                            const day_end_hour = (day + 1) * 24;

                            const job_start_in_day = Math.max(potential_start_hour, day_start_hour);
                            const job_end_in_day = Math.min(potential_end_hour, day_end_hour);
                            const job_hours_in_day = job_end_in_day - job_start_in_day;

                            if (job_hours_in_day <= 0) continue;

                            const current_daily_total = tester_daily_hours[tId]?.[day] ?? 0;

                            if (current_daily_total + job_hours_in_day > HOURS_PER_DAY) {
                                violates_daily_limit = true;
                                break; 
                            }
                            hours_to_add_per_day[day] = job_hours_in_day;
                        }

                        if (!violates_daily_limit) {
                            tester_free[tId] = potential_end_hour;
                            machine_free[mId] = potential_end_hour;

                            for (const day in hours_to_add_per_day) {
                                const day_num = parseInt(day, 10);
                                tester_daily_hours[tId][day_num] = (tester_daily_hours[tId][day_num] ?? 0) + hours_to_add_per_day[day_num];
                            }

                            completed += 1;
                            assigned = true;
                            break;
                        }
                    }
                } 
            }
            if (assigned) {
                break; 
            }
        } 
    } 

    return completed;
}

// roulette selection (輪盤法擇優), 從總群中隨機取 beta * N 個基因
const roulette = (population: string[][], beta: number): string[][] => {

    const fitness_values = population.map((chromosome) => fitness(chromosome));
    const total_fitness = fitness_values.reduce((a, b) => a + b, 0);

    if (total_fitness === 0) {
        console.warn("Total fitness is zero. Performing random selection.");
        const selected_count = Math.floor(beta * population.length);
        const shuffled_population = [...population].sort(() => 0.5 - Math.random());
        return shuffled_population.slice(0, selected_count);
    }

    const probabilities = fitness_values.map((value) => value / total_fitness);

    const selected: string[][] = [];
    const selected_count = Math.floor(beta * population.length);

    for (let i = 0; i < selected_count; i++) {
        let rand = Math.random();
        let cumulative_probability = 0;
        for (let j = 0; j < probabilities.length; j++) {
            cumulative_probability += probabilities[j];
            if (rand <= cumulative_probability + 1e-9) {
                selected.push(population[j]);
                break;
            }
        }
        if (selected.length <= i) {
            console.warn("Roulette fallback triggered.");
            selected.push(population[population.length - 1]);
        }
    }
    return selected;
}

// Single-point crossover(交配)
const crossover = (parent1: string[], parent2: string[]): [string[], string[]] => {
    if (!Array.isArray(parent1) || !Array.isArray(parent2) || parent1.length === 0 || parent1.length !== parent2.length) {
        console.error("Invalid parents for crossover:", parent1, parent2);
        return [[...parent1], [...parent2]];
    }
    const length = parent1.length;
    
    const crossover_point = Math.floor(Math.random() * (length - 1)) + 1;

    const child1_part1 = parent1.slice(0, crossover_point);
    const child1_part2 = parent2.filter(jobId => !child1_part1.includes(jobId)); 
    const child1 = [...child1_part1, ...child1_part2];

    const child2_part1 = parent2.slice(0, crossover_point);
    const child2_part2 = parent1.filter(jobId => !child2_part1.includes(jobId));
    const child2 = [...child2_part1, ...child2_part2];

     if (child1.length !== length || new Set(child1).size !== length) {
         console.warn("Crossover resulted in invalid child1. Returning parents.");
         return [[...parent1], [...parent2]]; 
     }
      if (child2.length !== length || new Set(child2).size !== length) {
         console.warn("Crossover resulted in invalid child2. Returning parents.");
         return [[...parent1], [...parent2]]; 
     }


    return [child1, child2];
}


// Swap mutation(突變)
const mutation = (chromosome: string[], mutation_rate: number): string[] => {
    if (!Array.isArray(chromosome)) {
        console.error("Invalid chromosome for mutation:", chromosome);
        return [];
    }
    const mutated_chromosome = [...chromosome];
    for (let i = 0; i < mutated_chromosome.length; i++) {
        if (Math.random() < mutation_rate) {
            const random_index = Math.floor(Math.random() * mutated_chromosome.length);
            [mutated_chromosome[i], mutated_chromosome[random_index]] = [mutated_chromosome[random_index], mutated_chromosome[i]];
        }
    }
    return mutated_chromosome;
}

// GA 實作
const genetic_algorithm = (initial_population: string[][], generations: number, beta: number, mutation_rate: number, elitism_count: number = 1): string[][] => {
    let population = [...initial_population];
    const population_size = population.length;

    if (population_size === 0) {
        console.error("Initial population is empty.");
        return [];
    }

    for (let i = 0; i < generations; i++) {
        population.sort((a, b) => fitness(b) - fitness(a));

        const new_population: string[][] = [];

        // Elitism 機制: 保留部分優秀染色體, 預設為 1 個
        for (let k = 0; k < elitism_count && k < population.length; k++) {
            new_population.push(population[k]);
        }

        const selected_parents = roulette(population, beta);

        let offspring_count = 0;
        while (new_population.length < population_size) {
            if (selected_parents.length < 2) {
                 console.warn(`Generation ${i}: Not enough parents selected by roulette. Filling remaining spots.`);
                 const fill_index = Math.min(offspring_count % elitism_count, elitism_count - 1); 
                 new_population.push(mutation(population[fill_index], mutation_rate));
                 if (new_population.length >= population_size) break;
                 continue; 
            }

            let parent1_idx = Math.floor(Math.random() * selected_parents.length);
            let parent2_idx = Math.floor(Math.random() * selected_parents.length);
            if (selected_parents.length > 1) {
                while (parent1_idx === parent2_idx) {
                    parent2_idx = Math.floor(Math.random() * selected_parents.length);
                }
            }

            const parent1 = selected_parents[parent1_idx];
            const parent2 = selected_parents[parent2_idx];

            const [child1, child2] = crossover(parent1, parent2);

            if (new_population.length < population_size) {
                new_population.push(mutation(child1, mutation_rate));
                offspring_count++;
            }
            if (new_population.length < population_size) {
                new_population.push(mutation(child2, mutation_rate));
                offspring_count++;
            }
        }

        population = new_population; // 總群更新。
        console.log(`Generation ${i + 1}: Best Fitness = ${fitness(population[0])}`);
    }

    population.sort((a, b) => fitness(b) - fitness(a));
    return population;
}

// 沿用適應度的邏輯，按照 early first 插入工作排程給測試者，這邊的結果之後要寫入資料庫。
function decode_schedule(chromosome: string[]) {
    console.log("\n--- Decoding Best Schedule ---");

    const tester_free: { [testerId: string]: number } = {};
    const machine_free: { [machineId: string]: number } = {};

    const tester_daily_hours: { [testerId: string]: { [day: number]: number } } = {};
    const assignments: { jobId: string, testerId: string, machineId: string, startTime: number, completionTime: number }[] = [];
    const current_time = Date.now();
    const HOURS_PER_DAY = 8; 

    for (const tId in testers) {
        tester_free[tId] = 0;
        tester_daily_hours[tId] = {}; 
    }
    for (const mId in machines) {
        machine_free[mId] = 0;
    }

     for (const jobId of chromosome) {
        const job = jobs[jobId];
         if (!job || typeof job.duration !== 'number' || !(job.dueDate instanceof Date) || !job.testType) continue;

        let assigned = false;
        const jobDeadlineTimestamp = job.dueDate.getTime();
        const jobDuration = job.duration;


        for (const tId in testers) {
            if (assigned) break; 
            const tester = testers[tId];
            if (tester.testType.includes(job.testType as mini_lab_type.UserTestType)) {
                for (const mId in machines) {
                    const machine = machines[mId];
                    if (machine.testType === job.testType) {
                        const potential_start_hour = Math.max(tester_free[tId], machine_free[mId]);
                        const potential_end_hour = potential_start_hour + jobDuration;
                        const potential_completion_timestamp = current_time + potential_end_hour * 60 * 60 * 1000;

                        // Check Deadline
                        if (potential_completion_timestamp > jobDeadlineTimestamp) {
                            continue; 
                        }
                        
                        // 工時上限
                        let violates_daily_limit = false;
                        const hours_to_add_per_day: { [day: number]: number } = {};
                        const start_day = Math.floor(potential_start_hour / 24);
                        const end_day = Math.floor((potential_end_hour - 1e-6) / 24); // Use epsilon

                        for (let day = start_day; day <= end_day; day++) {
                            const day_start_hour = day * 24;
                            const day_end_hour = (day + 1) * 24;
                            const job_start_in_day = Math.max(potential_start_hour, day_start_hour);
                            const job_end_in_day = Math.min(potential_end_hour, day_end_hour);
                            const job_hours_in_day = job_end_in_day - job_start_in_day;

                            if (job_hours_in_day <= 0) continue;

                            const current_daily_total = tester_daily_hours[tId]?.[day] ?? 0;

                            if (current_daily_total + job_hours_in_day > HOURS_PER_DAY) {
                                violates_daily_limit = true;
                                break;
                            }
                            hours_to_add_per_day[day] = job_hours_in_day;
                        }

                        if (!violates_daily_limit) {
                            tester_free[tId] = potential_end_hour;
                            machine_free[mId] = potential_end_hour;

                            for (const day in hours_to_add_per_day) {
                                const day_num = parseInt(day, 10);
                                tester_daily_hours[tId][day_num] = (tester_daily_hours[tId][day_num] ?? 0) + hours_to_add_per_day[day_num];
                            }

                            assignments.push({
                                jobId: jobId,
                                testerId: tId,
                                machineId: mId,
                                startTime: potential_start_hour,
                                completionTime: potential_end_hour 
                            });
                            console.log(`Assigned Job ${jobId} (T: ${job.testType}, D: ${jobDuration}h) to Tester ${tId} & Machine ${mId}. Start: ${potential_start_hour.toFixed(2)}h, End: ${potential_end_hour.toFixed(2)}h`);
                            assigned = true;
                            break; 
                        }
                    }
                } 
            }
            if (assigned) {
                break; 
            }
        } 

        // 印出來看那些沒被 assigned, 以及他的原因
        if (!assigned) {
            let earliest_possible_end = Infinity;
            let reason = "deadline"; 
            for (const tId_log in testers) {
                if (testers[tId_log].testType.includes(job.testType as mini_lab_type.UserTestType)) {
                    for (const mId_log in machines) {
                        if (machines[mId_log].testType === job.testType) {
                            const start_log = Math.max(tester_free[tId_log] || 0, machine_free[mId_log] || 0);
                            const end_log = start_log + jobDuration;
                            earliest_possible_end = Math.min(earliest_possible_end, end_log);
                            
                            const start_day_log = Math.floor(start_log / 24);
                            const end_day_log = Math.floor((end_log - 1e-6) / 24);
                            for (let day_log = start_day_log; day_log <= end_day_log; day_log++) {
                               const day_start_hour_log = day_log * 24;
                               const day_end_hour_log = (day_log + 1) * 24;
                               const job_start_in_day_log = Math.max(start_log, day_start_hour_log);
                               const job_end_in_day_log = Math.min(end_log, day_end_hour_log);
                               const job_hours_in_day_log = job_end_in_day_log - job_start_in_day_log;
                               if (job_hours_in_day_log > 0 && ((tester_daily_hours[tId_log]?.[day_log] ?? 0) + job_hours_in_day_log > HOURS_PER_DAY)) {
                                   reason = "daily limit";
                                   break;
                               }
                            }
                            if (reason === "daily limit") break;
                        }
                    }
                }
                if (reason === "daily limit") break;
            }
            const completion_ts_log = current_time + earliest_possible_end * 60 * 60 * 1000;
            if (completion_ts_log > jobDeadlineTimestamp) reason = "deadline";

            console.log(`Could not assign Job ${jobId} (T: ${job.testType}, D: ${jobDuration}h, Due: ${job.dueDate.toISOString()}). Reason: ${reason}.`);
        }
    } 
    console.log("-----------------------------");
}

// 主程式
const main = () => {

    jobs = mock_tasks_data.reduce((acc, task) => {
        acc[task.id] = task as mini_lab_type.Task; // Cast needed as mock data might be simplified
        return acc;
    }, {} as { [taskId: string]: mini_lab_type.Task });

    testers = mock_user_data.reduce((acc, user) => {
        acc[user.id] = user as mini_lab_type.User; // Cast needed
        return acc;
    }, {} as { [testerId: string]: mini_lab_type.User });

    machines = mock_machine_data.reduce((acc, machine) => {
        acc[machine.id] = machine as mini_lab_type.Machine; // Cast needed
        return acc;
    }, {} as { [machineId: string]: mini_lab_type.Machine });

    // 2. Set GA parameters
    const N = 100; // Population size
    const generations = 25; // Reduced generations for quicker testing
    const beta = 0.5; // Selection pressure (proportion selected by roulette) - adjust as needed
    const mutation_rate = 0.02; // Mutation probability per gene
    const elitism_count = 2; // Keep the top 2 individuals

    // 3. Initialize population
    const initialPopulation = init_population(N);
     if (initialPopulation.length === 0 || !initialPopulation[0] || initialPopulation[0].length === 0) {
        console.error("Initialization failed: No jobs found or population is empty.");
        return;
    }


    // 4. Run the genetic algorithm
    const finalPopulation = genetic_algorithm(initialPopulation, generations, beta, mutation_rate, elitism_count);

    // 5. Process results
    if (!finalPopulation || finalPopulation.length === 0) {
        console.error("Genetic algorithm did not produce a valid final population.");
        return;
    }

    // The population is already sorted by the GA function
    const best_schedule_chromosome = finalPopulation[0];
    const best_fitness_score = fitness(best_schedule_chromosome); 

    console.log("\n--- Genetic Algorithm Finished ---");
    console.log("Population Size:", N);
    console.log("Generations:", generations);
    console.log("Elitism Count:", elitism_count);
    console.log("Mutation Rate:", mutation_rate);
    console.log("--- Best Schedule Found ---");
    console.log("Maximum completed jobs:", best_fitness_score);
    console.log("Best schedule chromosome (Job Order):", best_schedule_chromosome);

    decode_schedule(best_schedule_chromosome);
}

main();
