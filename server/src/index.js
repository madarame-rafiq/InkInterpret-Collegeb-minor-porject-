import express from "express";

const app = express();
const PORT = 5001;


app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({
        health: "Ok",
        message: "The InkInterpret server is healthy!."
    });
});

app.listen(PORT, () => {
    console.log(`The server is listening at port: ${PORT}`);
});