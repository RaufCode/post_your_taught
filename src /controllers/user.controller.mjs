import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.mts";
import { createUserSchema, updateUserSchema } from "../validators/user.schema.mts";
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1️⃣ Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // 2️⃣ Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // 3️⃣ Remove password before sending response
        const { password: _, refresh_token, ...safeUser } = user;
        // 4️⃣ Generate access token
        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" } // short-lived
        );
        // 5️⃣ Generate refresh token
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" } // long-lived
        );
        // 6️⃣ Store refresh token in database
        await prisma.user.update({
            where: { id: user.id },
            data: { refresh_token: refreshToken }
        });
        // 7️⃣ Return safe user + tokens
        res.json({
            message: "Login successful",
            user: safeUser,
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        const safeUsers = users.map(({ password, refresh_token, ...safeUser }) => safeUser);
        res.json({ count: users.length, users: safeUsers });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const createUser = async (req, res) => {
    try {
        // Validate request body
        const validatedData = createUserSchema.parse(req.body);
        const { first_name, last_name, user_name, email, password, role } = validatedData;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //find if user with the same email or username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { user_name }
                ]
            }
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User with the same email or username already exists"
            });
        }
        // Create user
        const user = await prisma.user.create({
            data: {
                first_name,
                last_name,
                user_name,
                email,
                password: hashedPassword,
                role: role ?? "user"
            }
        });
        res.status(201).json({
            message: "User created successfully",
            user
        });
    }
    catch (error) {
        // Handle Zod validation errors
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation failed",
                errors: error
            });
        }
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Remove password before sending
        const { password, ...safeUser } = user;
        res.json({
            user: safeUser
        });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const ID = Number(id);
    const validatedData = updateUserSchema.parse(req.body);
    const { first_name, last_name, user_name, email, role } = validatedData;
    const updatedUser = await prisma.user.findUnique({
        where: { id: ID }
    });
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    const user = await prisma.user.update({
        where: { id: ID },
        data: {
            first_name,
            last_name,
            user_name,
            email,
            role
        }
    });
    const { password, refresh_token, ...safeUser } = user;
    res.status(201).json({ message: "User updated successfully", user: safeUser });
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await prisma.user.delete({
            where: { id: userId }
        });
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        // Verify refresh token
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch (err) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        // Find user by ID from token payload
        const user = await prisma.user.findUnique({
            where: { id: payload.id }
        });
        if (!user || user.refresh_token !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        // Generate new access token
        const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
