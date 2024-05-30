import express from "express"
import cors from "cors"
import {router as authenticationRoutes } from "./authRoutes.js"

const app = express()

app.use(cors());
app.use(express.json());
app.use("/api", authenticationRoutes);

app.listen(3001, () => {
    console.log("server is running on port 3001");
})