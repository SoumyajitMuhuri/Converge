import "dotenv/config"
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import redisClient from "./src/config/redis.js";

const PORT = process.env.PORT || 3000;

const startServer = async () =>{
    await connectDB();

    await redisClient.connect();

app.listen(PORT,()=>{
    console.log(`Converge server running on http://localhost:${PORT}`);
});
};

startServer();