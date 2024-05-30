import express from "express"
import bcrypt from "bcrypt"
import {v4 as uuidv4} from "uuid"
import { StreamChat } from "stream-chat"
import dotenv from "dotenv";
//import { api_key, api_secret } from "./server.js"

dotenv.config();

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

const router = express.Router();
const serverClient = StreamChat.getInstance(api_key, api_secret);

router.post("/login", async (req, res) => {
    try {
        const {userName, password} = req.body;
        const response = await serverClient.queryUsers({ userName: {$eq: userName} });
        if(response.users.length === 0){
            return res.status(404).json({ msg: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, response.users[0].hashedPassword)
        const token = serverClient.createToken(response.users[0].id);
        if (passwordMatch) {
            return res.status(200).json({
                token,
                firstName: response.users[0].firstName,
                lastName: response.users[0].lastName,
                userName: response.users[0].userName,
                userId: response.users[0].id,
                hashedPassword: response.users[0].hashedPassword,
            })
        }
    } catch(error) {
        return res.status(500).json({ erro: error.data });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const {firstName, lastName, userName, password} = req.body;
        const response = await serverClient.queryUsers({ userName: {$eq: userName} });

        if(response.users.length > 0){
            return res.status(409).json({ msg: "User already exists" })
        }
        
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = serverClient.createToken(userId);

        return res.status(201).json({ token, userId, firstName, lastName, userName, hashedPassword });
    } catch(error) {
        return res.status(500).json({ erro: "internal error" });
    }
});

router.delete("/deleteAllUsers", async (req, res) => {
    try {
        const response = await serverClient.queryUsers({});
        console.log(response.users);
        const userIds = response.users.map(user => user.id);

        await Promise.all(userIds.map(userId => serverClient.deleteUser(userId, { hard: true })));

        return res.status(200).json({ msg: "All users deleted successfully" });
    } catch (error) {
        return res.status(500).json({ erro: "internal error" });
    }
});

export {router, api_key, api_secret};