import express from "express";
import cors from "cors";
import { success } from "zod";

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}));

app.use(express.json());

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Converge API is running",
    });
});

export default app;