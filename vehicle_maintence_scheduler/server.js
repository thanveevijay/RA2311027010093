const express=require("express");
const app=express();
const {Log}=require("../logging_middleware/log");

app.use(express.json());

let vehicleList=[];
let maintenanceLog=[];

function isValidVehicle(data){
    return data.id && data.name;
}

app.post("/vehicle",async(req,res)=>{
    try{
        const {id,name,type}=req.body;
        if(!isValidVehicle(req.body)){
            try{await Log("backend","error","route","Invalid vehicle data");}catch(e){}
            return res.status(400).json({
                message:"Vehicle ID and Name are required"
            });
        }
        const exists=vehicleList.find(v=>v.id===id);
        if(exists){
            try{await Log("backend","error","route","Duplicate vehicle entry");}catch(e){}
            return res.status(409).json({
                message:"Vehicle already exists in our system!"
            });
        }
        const newVehicle={
            id,
            name,
            type:type||"General"
        };
        vehicleList.push(newVehicle);
        try{await Log("backend","info","route","Vehicle added successfully");}catch(e){}
        res.json({
            message:"Vehicle successfully added to our system!",
            data:newVehicle
        });
    }
    catch(error){
        try{await Log("backend","error","route","Vehicle creation failed");}catch(e){}
        res.status(500).json({message:"Internal Server Error"});
    }
});

app.get("/vehicles",async(req,res)=>{
    try{await Log("backend","info","route","Fetching all vehicles");}catch(e){}
    res.json({
        count:vehicleList.length,
        vehicles:vehicleList
    });
});

app.post("/maintenance",async(req,res)=>{
    try{
        const {vehicleId,date,description}=req.body;
        if(!vehicleId||!date){
            try{await Log("backend","error","route","Invalid maintenance input");}catch(e){}
            return res.status(400).json({
                message:"Vehicle ID and date are required"
            });
        }
        const vehicle=vehicleList.find(v=>v.id===vehicleId);
        if(!vehicle){
            try{await Log("backend","error","route","Vehicle not found for maintenance");}catch(e){}
            return res.status(404).json({
                message:"Vehicle not found in our system!"
            });
        }
        const record={
            recordId:Date.now().toString(),
            vehicleId,
            date,
            description:description||"General Maintenance"
        };
        maintenanceLog.push(record);
        try{await Log("backend","info","route","Maintenance scheduled");}catch(e){}
        res.json({
            message:"Maintenance successfully scheduled in our system!",
            data:record
        });
    }
    catch(error){
        try{await Log("backend","error","route","Maintenance scheduling failed");}catch(e){}
        res.status(500).json({message:"Internal Server Error"});
    }
});

app.get("/maintenance/:vehicleId",async(req,res)=>{
    const {vehicleId}=req.params;
    const records=maintenanceLog.filter(record=>record.vehicleId===vehicleId);
    if(records.length===0){
        try{await Log("backend","warn","route","No maintenance records found");}catch(e){}
        return res.json({
            message:"No maintenance records found in our system!",
            data:[]
        });
    }
    try{await Log("backend","info","route","Fetched maintenance records");}catch(e){}
    res.json({
        count:records.length,
        data:records
    });
});

app.listen(3001,()=>{
    console.log("Vehicle Maintenance Scheduler running on port 3001");
});