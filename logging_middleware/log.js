const axios = require("axios");
let accessToken = "";
const setToken = (token) => {
    accessToken = token;
};
const Log = async (stack, level, pkg, message) => {
    try {
        await axios.post(
            "http://20.207.122.201/evaluation-service/logs",
            {
                stack: stack,
                level: level,
                package: pkg,
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
    } catch (error) {
        console.error("Log Failed:", error.response?.data || error.message);
    }
};
module.exports = { Log, setToken };