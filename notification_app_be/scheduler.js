const axios = require("axios");

const BASE_URL = "http://20.207.122.201/evaluation-service";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ0djgxOTdAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTU2NywiaWF0IjoxNzc3NzAwNjY3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjdkNTg5ZDEtOGU1ZC00ZjMzLTlkYmUtOTRlMGQzOGNjYjc4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidGhhbnZlZSB2aWpheWFrdW1hciIsInN1YiI6IjQ2OWZjNTU2LWJhNDUtNDZiYS05NWQ3LTIyMTEwNmFmMzllYSJ9LCJlbWFpbCI6InR2ODE5N0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6InRoYW52ZWUgdmlqYXlha3VtYXIiLCJyb2xsTm8iOiJyYTIzMTEwMjcwMTAwOTMiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI0NjlmYzU1Ni1iYTQ1LTQ2YmEtOTVkNy0yMjExMDZhZjM5ZWEiLCJjbGllbnRTZWNyZXQiOiJDWUZ3ZVdBeEJETWpqVlJtIn0.WE2oG8UwlP5M1bwkKS3uO8UPI_29o-9-JPMrXvA0QKc";

const headers = {
    Authorization: `Bearer ${TOKEN}`
};

function knapsack(tasks, capacity) {
    const n = tasks.length;

    const dp = Array(n + 1).fill().map(() =>
        Array(capacity + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = tasks[i - 1];

        for (let w = 0; w <= capacity; w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    Impact + dp[i - 1][w - Duration]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    let w = capacity;
    const selected = [];

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(tasks[i - 1]);
            w -= tasks[i - 1].Duration;
        }
    }

    return selected;
}

async function runScheduler() {
    try {
        const depotRes = await axios.get(`${BASE_URL}/depots`, { headers });
        const depots = depotRes.data.depots;

        const vehicleRes = await axios.get(`${BASE_URL}/vehicles`, { headers });
        const vehicles = vehicleRes.data.vehicles;

        console.log("==== SCHEDULER OUTPUT ====\n");

        for (const depot of depots) {
            const capacity = depot.MechanicHours;

            // Find matching vehicle tasks
            const vehicleTasks = vehicles.flatMap(v => v.tasks || []);

            const selectedTasks = knapsack(vehicleTasks, capacity);

            const totalImpact = selectedTasks.reduce(
                (sum, t) => sum + t.Impact,
                0
            );

            console.log(`Depot ID: ${depot.ID}`);
            console.log(`Capacity: ${capacity}`);
            console.log(`Selected Tasks:`);
            console.log(selectedTasks);
            console.log(`Total Impact: ${totalImpact}`);
            console.log("\n------------------------\n");
        }

    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

runScheduler();
