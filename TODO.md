# Authentication Architecture Refactoring

## Task Overview

Refactor route protection to use explicit per-route authentication instead of fragile `router.use(authenticate)` pattern.

## Progress Checklist

### Route Files
- [x] `src/modules/posts/route.ts` - Refactor to per-route auth
- [x] `src/modules/comments/route.ts` - Refactor to per-route auth

- [x] `src/modules/likes/route.ts` - Refactor to per-route auth
- [x] `src/modules/notifications/route.ts` - Refactor to per-route auth
- [x] `src/modules/users/route.ts` - Refactor to per-route auth

### Configuration Files

- [x] `src/config/swagger.ts` - Verified: No global security, proper bearerAuth config

## Implementation Details

### Public Routes (No Auth Required)

- GET /api/posts - List all posts
- GET /api/posts/:id - Get single post
- GET /api/posts/:postId/comments - Get comments for a post

### Protected Routes (Auth Required)

- POST /api/posts - Create post
- PATCH /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post
- POST /api/posts/:postId/comments - Create comment
- DELETE /api/comments/:id - Delete comment
- POST /api/posts/:postId/like - Toggle like
- All /api/users/\* routes
- All /api/notifications/\* routes

## Pattern to Apply

```typescript
// Public route - NO authenticate middleware
router.get("/public-route", handler);

// Protected route - WITH authenticate middleware
router.post("/protected-route", authenticate, handler);
```

## Swagger Pattern

```typescript
// Public endpoint - NO security field
/**
 * @swagger
 * /public-route:
 *   get:
 *     summary: Public endpoint
 *     // NO security field
 */

// Protected endpoint - WITH security field
/**
 * @swagger
 * /protected-route:
 *   post:
 *     summary: Protected endpoint
 *     security:
 *       - bearerAuth: []
 */
```
