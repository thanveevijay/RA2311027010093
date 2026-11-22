const express = require("express");
const Log = require("../logging_middleware/log");
const { getDepots, getVehicles } = require("./api");
const { selectTasks } = require("./scheduler");

const app = express();


const TOKEN = process.env.EXTERNAL_API_TOKEN;

app.get("/schedule", async (req, res) => {
  try {
    if (!TOKEN) {
      return res.status(503).json({ error: "External API is not configured. Set EXTERNAL_API_TOKEN." });
    }
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

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await Log("backend", "info", "service", "Backend started");
});
