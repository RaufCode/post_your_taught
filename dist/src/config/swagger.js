import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.ts";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blog Backend API",
            version: "1.0.0",
            description: "A comprehensive blog backend API with authentication, posts, comments, likes, and notifications",
            contact: {
                name: "API Support",
                email: "support@blogapi.com",
            },
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}/api`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your JWT token in the format: Bearer {token}",
                },
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "refreshToken",
                    description: "Refresh token stored in HTTP-only cookie",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        email: { type: "string", format: "email" },
                        username: { type: "string" },
                        profileImage: { type: "string", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Post: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" },
                        content: { type: "string" },
                        images: { type: "array", items: { type: "string" } },
                        viewCount: { type: "integer" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        authorId: { type: "string", format: "uuid" },
                        author: { $ref: "#/components/schemas/User" },
                    },
                },
                Comment: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        content: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        authorId: { type: "string", format: "uuid" },
                        author: { $ref: "#/components/schemas/User" },
                        postId: { type: "string", format: "uuid" },
                    },
                },
                Like: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        createdAt: { type: "string", format: "date-time" },
                        userId: { type: "string", format: "uuid" },
                        postId: { type: "string", format: "uuid" },
                    },
                },
                Notification: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        type: { type: "string", enum: ["COMMENT", "LIKE", "VIEW"] },
                        isRead: { type: "boolean" },
                        createdAt: { type: "string", format: "date-time" },
                        actorId: { type: "string", format: "uuid" },
                        actor: { $ref: "#/components/schemas/User" },
                        recipientId: { type: "string", format: "uuid" },
                        postId: { type: "string", format: "uuid", nullable: true },
                        commentId: { type: "string", format: "uuid", nullable: true },
                        likeId: { type: "string", format: "uuid", nullable: true },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string" },
                        errors: { type: "object", nullable: true },
                    },
                },
                Pagination: {
                    type: "object",
                    properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 100 },
                        totalPages: { type: "integer", example: 10 },
                    },
                },
            },
            responses: {
                UnauthorizedError: {
                    description: "Access token is missing or invalid",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            example: {
                                success: false,
                                message: "Access token required",
                            },
                        },
                    },
                },
                ValidationError: {
                    description: "Validation failed",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            example: {
                                success: false,
                                message: "Validation failed",
                                errors: {
                                    email: ["Invalid email address"],
                                },
                            },
                        },
                    },
                },
                NotFoundError: {
                    description: "Resource not found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" },
                            example: {
                                success: false,
                                message: "Resource not found",
                            },
                        },
                    },
                },
            },
        },
        tags: [
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Users", description: "User management endpoints" },
            { name: "Posts", description: "Blog post endpoints" },
            { name: "Comments", description: "Comment endpoints" },
            { name: "Likes", description: "Like endpoints" },
            { name: "Notifications", description: "Notification endpoints" },
        ],
    },
    apis: ["./src/modules/**/*.ts", "./app.ts"],
};
export const swaggerSpec = swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map