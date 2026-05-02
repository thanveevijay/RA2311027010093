const express=require("express");
const app=express();
const {Log}=require("../logging_middleware/log");

app.use(express.json());

let notifications=[];

app.post("/notify",async(req,res)=>{
    try{
        const {user,message}=req.body;
        if(!user||!message){
            try{await Log("backend","error","route","Invalid notification data");}catch(e){}
            return res.status(400).json({
                message:"User and message are required"
            });
        }
        const notification={
            id:Date.now().toString(),
            user,
            message
        };
        notifications.push(notification);
        try{await Log("backend","info","route","Notification created");}catch(e){}
        res.json({
            message:"Notification sent successfully",
            data:notification
        });
    }
    catch(error){
        try{await Log("backend","error","route","Notification creation failed");}catch(e){}
        res.status(500).json({message:"Internal Server Error"});
    }
});

app.get("/notifications",async(req,res)=>{
    try{await Log("backend","info","route","Fetching notifications");}catch(e){}
    res.json({
        count:notifications.length,
        data:notifications
    });
});

app.listen(3002,()=>{
    console.log("Notification App running on port 3002");
});