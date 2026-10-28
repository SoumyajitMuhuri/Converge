import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({
    origin:process.env.CLIENT_URL,
}));

app.use(express.json({ limit:"10kb" }));

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Converge API is running",
    });
});

app.use("/api/auth", authRoutes);

export default app;