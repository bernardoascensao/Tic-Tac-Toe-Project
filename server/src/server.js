import express from "express"
import cors from "cors"
import {router as authenticationRoutes } from "./authRoutes.js"
import cookieParser from "cookie-parser";

const app = express()
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:9000', // frontend URL
  credentials: true,             // VERY IMPORTANT: This allows cookies to be sent with the request
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api", authenticationRoutes);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})