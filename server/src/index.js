import express from "express";
import { pool } from "./database/pool.js";

const app = express();
const PORT = 5001;


app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({
        health: "Ok",
        message: "The InkInterpret server is healthy!."
    });
});

app.get('/api/health/database', async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.status(200).json({
            health: 'Ok',
            databse: "connected"
        });
    } catch (error) {
        console.error("Databse connection error", error);
        res.status(503).json({
            health: "unhealthy",
            databse: "disconnected"
        });
    }
});

app.listen(PORT, () => {
    console.log(`The server is listening at port: ${PORT}`);
});