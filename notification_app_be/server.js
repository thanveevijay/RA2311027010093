const express = require("express");
const Log = require("../logging_middleware/log");
const { getDepots, getVehicles } = require("./api");
const { selectTasks } = require("./scheduler");

const app = express();


const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ0djgxOTdAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTU2NywiaWF0IjoxNzc3NzAwNjY3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjdkNTg5ZDEtOGU1ZC00ZjMzLTlkYmUtOTRlMGQzOGNjYjc4IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidGhhbnZlZSB2aWpheWFrdW1hciIsInN1YiI6IjQ2OWZjNTU2LWJhNDUtNDZiYS05NWQ3LTIyMTEwNmFmMzllYSJ9LCJlbWFpbCI6InR2ODE5N0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6InRoYW52ZWUgdmlqYXlha3VtYXIiLCJyb2xsTm8iOiJyYTIzMTEwMjcwMTAwOTMiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiI0NjlmYzU1Ni1iYTQ1LTQ2YmEtOTVkNy0yMjExMDZhZjM5ZWEiLCJjbGllbnRTZWNyZXQiOiJDWUZ3ZVdBeEJETWpqVlJtIn0.WE2oG8UwlP5M1bwkKS3uO8UPI_29o-9-JPMrXvA0QKc";

app.get("/schedule", async (req, res) => {
  try {
    await Log("backend", "info", "route", "Schedule API called");

    const depots = await getDepots(TOKEN);
    const vehicles = await getVehicles(TOKEN);

    console.log("Depots:", depots);
    console.log("Vehicles:", vehicles);

    
    if (!Array.isArray(depots) || !Array.isArray(vehicles)) {
      throw new Error("Invalid data from API");
    }

    const results = [];

    for (let depot of depots) {
        const result = selectTasks(vehicles, depot.MechanicHours);

         results.push({
        depotId: depot.ID,
        maxImpact: result.maxImpact,
        totalDuration: result.totalDuration,
        selectedVehicles: result.selectedVehicles
  });
}

    await Log("backend", "info", "service", "Scheduling completed");

    res.json(results);

  } catch (err) {
    console.error("ERROR:", err.message);  
    await Log("backend", "fatal", "handler", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, async () => {
  console.log("Server running on port 3000");
  await Log("backend", "info", "service", "Backend started");
});
