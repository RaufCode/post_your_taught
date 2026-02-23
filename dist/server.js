import dotenv from "dotenv";
import app from "./app.ts";
import { env } from "./src/config/env.ts";
import { prisma } from "./src/config/database.ts";
import { logger } from "./src/config/logger.ts";
dotenv.config();
const PORT = env.PORT || 3000;
// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    logger.info({ message: `${signal} received. Starting graceful shutdown...` });
    // Close database connection
    await prisma.$disconnect();
    logger.info({ message: "Database connection closed" });
    process.exit(0);
};
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logger.error({
        message: "Uncaught Exception",
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    logger.error({
        message: "Unhandled Rejection",
        reason: reason instanceof Error ? reason.message : String(reason),
    });
    process.exit(1);
});
// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
// Start server
const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info({ message: "Database connected successfully" });
        app.listen(PORT, () => {
            logger.info({
                message: "Server started",
                port: PORT,
                environment: env.NODE_ENV,
            });
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        logger.error({
            message: "Failed to start server",
            error: error instanceof Error ? error.message : "Unknown error",
        });
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map