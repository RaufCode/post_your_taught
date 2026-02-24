import express from "express";
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { env } from "./src/config/env.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { apiLimiter } from "./src/middleware/rateLimit.js";
import { swaggerSpec } from "./src/config/swagger.js";
// Import routes
import authRoutes from "./src/modules/auth/route.js";
import usersRoutes from "./src/modules/users/route.js";
import postsRoutes from "./src/modules/posts/route.js";
import commentsRoutes from "./src/modules/comments/route.js";
import likesRoutes from "./src/modules/likes/route.js";
import notificationsRoutes from "./src/modules/notifications/route.js";
const app = express();
// Security middleware
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Rate limiting
app.use("/api/", apiLimiter);
// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Blog API Documentation",
}));
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
// API routes
app.use("/api/auth", authRoutes);
app.use("/api", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api", commentsRoutes);
app.use("/api", likesRoutes);
app.use("/api", notificationsRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// Global error handler
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map