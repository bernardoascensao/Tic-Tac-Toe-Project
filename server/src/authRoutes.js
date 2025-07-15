import express from "express"
import bcrypt from "bcryptjs"
import {v4 as uuidv4} from "uuid"
import { StreamChat } from "stream-chat"
import dotenv from "dotenv";
import moment from 'moment';
import db from '../data/db.js';

dotenv.config();

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

const router = express.Router();
const serverClient = StreamChat.getInstance(api_key, api_secret);

router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        console.log("Login attempt for user:", username);
        
        // const response = await serverClient.queryUsers({ userName: {$eq: username} });
        const usersFound = await db('users').where({ username })
        if(usersFound.length === 0){
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if the password matches the hashed password received from StreamChat
        console.log("User found in DB:", usersFound);
        const passwordMatch = await bcrypt.compare(password, usersFound[0].hashed_password)

        if (passwordMatch) {
            const user = usersFound[0];

            // Set up the cookie with the token with a 24-hour expiration
            res.cookie("tictactoe_token", user.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                userId: user.id,
                token: user.token
            })
        } else {
            // If the password does not match, return an error
            console.error("Password mismatch for user:", username);
            return res.status(401).json({ msg: "Invalid password" });
        }
    } catch(error) {
        console.error("Error during login:", error);
        return res.status(500).json({ erro: error.data });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const {firstName, lastName, userName, password} = req.body;
        // const response = await serverClient.queryUsers({ userName: {$eq: userName} });
        const response = await db('users').where({ username: userName });

        if(response.length > 0){
            return res.status(409).json({ msg: "User already exists" })
        }
        
        // Create a new user with a unique ID and hashed password
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create token with a 1-hour expiration
        const timestamp = Number(moment().add("1h").format("X"));
        const token = serverClient.createToken(userId, timestamp);

        await serverClient.upsertUser({
            id: userId,
            role: 'user',
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            hashedPassword: hashedPassword
        });

        await db('users')
            .insert({
                id: userId,
                username: userName,
                hashed_password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
                token
            })

        // Set up the cookie with the token
        res.cookie("tictactoe_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({ userId, firstName, lastName, userName, token });
    } catch(error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ erro: "internal error" });
    }
});

router.get("/refresh-token", async (req, res) => {
    try {
        const { tictactoe_token } = req.cookies;
        if (!tictactoe_token) {
            return res.status(401).json({ msg: "No token found in cookies" });
        }

        // Get the user associated with the token
        const user = await db('users')
            .where({ token: tictactoe_token })
            .first();

        console.log("User found for token refresh:", user);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Create a new token with a 1-hour expiration
        const timestamp = Number(moment().add(1, "hour").format("X"));
        const newToken = serverClient.createToken(user.id, timestamp);

        // Update the token in the database
        await db('users')
            .where({ id: user.id })
            .update({ token: newToken });

        // Set the new token in the cookie with 24-hour expiration
        res.cookie("tictactoe_token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ newToken });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/deleteAllUsers", async (req, res) => {
    try {
        const response = await serverClient.queryUsers({});
        console.log(response.users);
        const userIds = response.users.map(user => user.id);

        await Promise.all(userIds.map(userId => serverClient.deleteUser(userId, { hard: true })));

        await db('users').del(); // Delete all users from the database

        return res.status(200).json({ msg: "All users deleted successfully" });
    } catch (error) {
        return res.status(500).json({ erro: "internal error" });
    }
});

// Endpoint to check if the user is authenticated
router.get("/me", async (req, res) => {
    try {
        const { tictactoe_token } = req.cookies;
        if (!tictactoe_token) {
            return res.status(401).json({ msg: "Not authenticated" });
        }

        // Get the user associated with the token
        const user = await db('users')
            .where({ token: tictactoe_token })
            .first();

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // return user details
        return res.status(200).json({
            userName: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            userId: user.id,
            token: tictactoe_token
        });

    } catch (error) {
        console.error("Error fetching user session:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("tictactoe_token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
    return res.status(200).json({ msg: "Logged out successfully" });
});

export {router};