const axios = require("axios");
const Log = require("../logging_middleware/logger");


const BASE_URL = "http://20.244.56.144/evaluation-service";


function getHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}


async function fetchWithRetry(url, config, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await axios.get(url, config);
    } catch (err) {
      if (i === retries) throw err;

      console.log(`Retrying ${url}... (${i + 1})`);
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}


async function getDepots(token) {
  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/depots/list`,
      getHeaders(token)
    );

    console.log("Depot API response:", res.data);

    await Log("backend", "info", "service", "Fetched depots data");

    return res.data.depots;

  } catch (err) {
    console.error("Depot API Error:", err.message);

    await Log("backend", "warn", "service", "Using fallback depot data");

   
    return [
      { ID: "D1", MechanicHours: 10 },
      { ID: "D2", MechanicHours: 15 }
    ];
  }
}


async function getVehicles(token) {
  try {
    const res = await fetchWithRetry(
      `${BASE_URL}/vehicles/list`,
      getHeaders(token)
    );

    console.log("Vehicle API response:", res.data);

    await Log("backend", "info", "service", "Fetched vehicles data");

    return res.data.vehicles;

  } catch (err) {
    console.error("Vehicle API Error:", err.message);

    await Log("backend", "warn", "service", "Using fallback vehicle data");

    
    return [
      { ID: "V1", Duration: 5, Impact: 10 },
      { ID: "V2", Duration: 7, Impact: 13 },
      { ID: "V3", Duration: 3, Impact: 6 }
    ];
  }
}

module.exports = { getDepots, getVehicles };