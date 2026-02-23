import express from "express";
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { env } from "./src/config/env.ts";
import { errorHandler } from "./src/middleware/errorHandler.ts";
import { apiLimiter } from "./src/middleware/rateLimit.ts";
import { swaggerSpec } from "./src/config/swagger.ts";
// Import routes
import authRoutes from "./src/modules/auth/route.ts";
import usersRoutes from "./src/modules/users/route.ts";
import postsRoutes from "./src/modules/posts/route.ts";
import commentsRoutes from "./src/modules/comments/route.ts";
import likesRoutes from "./src/modules/likes/route.ts";
import notificationsRoutes from "./src/modules/notifications/route.ts";
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