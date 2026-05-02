const express=require("express");
const app=express();
const axios=require("axios");
const logger=require("./middleware");
const {Log, setToken}=require("./log");

app.use(express.json());
app.use(logger);

app.get("/",(req,res) => {
    res.send("Logging Middleware Working!");
});

app.post("/register",async(req,res) => {
    try {
        const response = await axios.post(
            "http://20.207.122.201/evaluation-service/register",
            {
                email: "tv8197@srmist.edu.in",
                name: "Thanvee Vijayakumar",
                mobileNo: "6384253212",
                githubUsername: "thanveevijay",
                rollNo: "RA2311027010093",
                accessCode: "QkbpxH"
            }
        );
        await Log("backend","info","route","User Registration Successful");
        res.json(response.data);
    }
    catch (error) {
        await Log("backend","error","route","User Registration Failed");
        console.error(error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data || "Registration Failed"
        });
    }
});

app.post("/auth", async (req, res) => {
    try {
        const response = await axios.post(
            "http://20.207.122.201/evaluation-service/auth",
            {
                email: "tv8197@srmist.edu.in",
                name: "Thanvee Vijayakumar",
                rollNo: "RA2311027010093",
                accessCode: "QkbpxH",
                clientID: "469fc556-ba45-46ba-95d7-221106af39ea",
                clientSecret: "CYFweWAxBDMjjVRm"
            }
        );
        setToken(response.data.access_token);
        Log("backend","info","route","Authentication Successful");
        res.json(response.data);
    }
    catch (error) {
        Log("backend","error","route","Authentication Failed");
        console.error(error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data || "Auth Failed"
        });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});