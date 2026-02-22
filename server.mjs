import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src /routes/user.routes.mts';
import postRoutes from './src /routes/post.routes.mts';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './src /config/swagger';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
