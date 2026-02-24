    # Blog Backend API Documentation

**Base URL:** `http://localhost:3000/api`

**Swagger UI:** `http://localhost:3000/api-docs`

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints Overview

| Category          | Endpoints                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **Auth**          | Register, Login, Refresh Token, Logout                                                   |
| **Users**         | Get Profile, Update Profile, Get My Posts, Get My Notifications, Mark Notifications Read |
| **Posts**         | Get All, Get Single, Create, Update, Delete                                              |
| **Comments**      | Get by Post, Create, Delete                                                              |
| **Likes**         | Toggle Like on Post                                                                      |
| **Notifications** | Get My Notifications, Get Unread Count, Mark as Read, Mark All as Read                   |

---

## 1. AUTHENTICATION

### 1.1 Register User

**POST** `/auth/register`

**Description:** Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Validation Rules:**

- `email`: Valid email format (required)
- `username`: 3-30 characters, letters/numbers/underscores only (required)
- `password`: Minimum 8 characters, must contain uppercase, lowercase, and number (required)

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "profileImage": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Error Responses:**

- `400`: Validation error
- `409`: User with this email already exists

---

### 1.2 Login User

**POST** `/auth/login`

**Description:** Authenticate user and receive access tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "profileImage": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Headers:**

- `Set-Cookie`: HTTP-only cookie with refresh token

**Error Responses:**

- `401`: Invalid email or password

---

### 1.3 Refresh Token

**POST** `/auth/refresh`

**Description:** Get a new access token using a refresh token.

**Request Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

**Error Responses:**

- `401`: Invalid or expired refresh token

---

### 1.4 Logout User

**POST** `/auth/logout`

**Description:** Logout user and invalidate refresh token.

**Authentication:** Optional (cookie-based or body-based refresh token)

**Request Body (optional):**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Headers:**

- `Set-Cookie`: Clears the refresh token cookie

---

## 2. USERS

### 2.1 Get Current User Profile

**GET** `/users/me`

**Description:** Get the authenticated user's profile information.

**Authentication:** Required (Bearer token)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "profileImage": "https://cloudinary.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `401`: Unauthorized

---

### 2.2 Update Current User Profile

**PATCH** `/users/me`

**Description:** Update the authenticated user's profile.

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

**Request Body:**

```
username: johndoe (optional)
profileImage: [binary file] (optional)
```

**Validation Rules:**

- `username`: 3-30 characters, letters/numbers/underscores only

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "profileImage": "https://cloudinary.com/new-image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Validation error
- `401`: Unauthorized

---

### 2.3 Get Current User's Posts

**GET** `/users/me/posts`

**Description:** Get all posts created by the authenticated user with pagination.

**Authentication:** Required (Bearer token)

**Query Parameters:**

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "My Post",
        "content": "Post content...",
        "images": ["https://cloudinary.com/image1.jpg"],
        "authorId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "author": {
          "id": "uuid",
          "username": "johndoe",
          "profileImage": null
        },
        "_count": {
          "comments": 5,
          "likes": 10
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses:**

- `401`: Unauthorized

---

### 2.4 Get Current User's Notifications

**GET** `/users/me/notifications`

**Description:** Get all notifications for the authenticated user with pagination.

**Authentication:** Required (Bearer token)

**Query Parameters:**

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "LIKE",
        "message": "johndoe liked your post",
        "isRead": false,
        "actorId": "uuid",
        "postId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "actor": {
          "id": "uuid",
          "username": "johndoe",
          "profileImage": null
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses:**

- `401`: Unauthorized

---

### 2.5 Mark Notification as Read

**PATCH** `/users/me/notifications/:id/read`

**Description:** Mark a specific notification as read.

**Authentication:** Required (Bearer token)

**Path Parameters:**

- `id`: Notification ID (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

**Error Responses:**

- `401`: Unauthorized
- `404`: Notification not found

---

### 2.6 Mark All Notifications as Read

**PATCH** `/users/me/notifications/read-all`

**Description:** Mark all notifications as read for the authenticated user.

**Authentication:** Required (Bearer token)

**Success Response (200):**

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

**Error Responses:**

- `401`: Unauthorized

---

## 3. POSTS

### 3.1 Get All Posts

**GET** `/posts`

**Description:** Get all posts with pagination.

**Query Parameters:**

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "My First Blog Post",
        "content": "This is the content of my blog post...",
        "images": ["https://cloudinary.com/image1.jpg"],
        "authorId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "author": {
          "id": "uuid",
          "username": "johndoe",
          "profileImage": null
        },
        "_count": {
          "comments": 5,
          "likes": 10
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 3.2 Get Single Post

**GET** `/posts/:id`

**Description:** Get a single post by ID.

**Path Parameters:**

- `id`: Post ID (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "My First Blog Post",
    "content": "This is the content of my blog post...",
    "images": ["https://cloudinary.com/image1.jpg"],
    "authorId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": "uuid",
      "username": "johndoe",
      "profileImage": null
    },
    "_count": {
      "comments": 5,
      "likes": 10
    }
  }
}
```

**Error Responses:**

- `404`: Post not found

---

### 3.3 Create Post

**POST** `/posts`

**Description:** Create a new blog post.

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

**Request Body:**

```
title: My First Blog Post (required)
content: This is the content of my blog post... (required)
images: [binary files] (optional, multiple)
```

**Validation Rules:**

- `title`: 1-200 characters (required)
- `content`: Minimum 1 character (required)

**Success Response (201):**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "uuid",
    "title": "My First Blog Post",
    "content": "This is the content of my blog post...",
    "images": ["https://cloudinary.com/image1.jpg"],
    "authorId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Validation error
- `401`: Unauthorized

---

### 3.4 Update Post

**PATCH** `/posts/:id`

**Description:** Update an existing post. Only the post author can update.

**Authentication:** Required (Bearer token)

**Content-Type:** `multipart/form-data`

**Path Parameters:**

- `id`: Post ID (UUID)

**Request Body:**

```
title: Updated Post Title (optional)
content: Updated content... (optional)
images: [binary files] (optional, multiple)
```

**Validation Rules:**

- `title`: 1-200 characters
- `content`: Minimum 1 character

**Success Response (200):**

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Post Title",
    "content": "Updated content...",
    "images": ["https://cloudinary.com/new-image.jpg"],
    "authorId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Not authorized to update this post
- `404`: Post not found

---

### 3.5 Delete Post

**DELETE** `/posts/:id`

**Description:** Delete a post. Only the post author can delete.

**Authentication:** Required (Bearer token)

**Path Parameters:**

- `id`: Post ID (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Responses:**

- `401`: Unauthorized
- `403`: Not authorized to delete this post
- `404`: Post not found

---

## 4. COMMENTS

### 4.1 Get Comments by Post

**GET** `/posts/:postId/comments`

**Description:** Get all comments for a specific post with pagination.

**Path Parameters:**

- `postId`: Post ID (UUID)

**Query Parameters:**

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "content": "This is a great post!",
        "postId": "uuid",
        "authorId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "author": {
          "id": "uuid",
          "username": "janedoe",
          "profileImage": null
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses:**

- `404`: Post not found

---

### 4.2 Create Comment

**POST** `/posts/:postId/comments`

**Description:** Create a new comment on a post.

**Authentication:** Required (Bearer token)

**Path Parameters:**

- `postId`: Post ID (UUID)

**Request Body:**

```json
{
  "content": "This is a great post!"
}
```

**Validation Rules:**

- `content`: 1-1000 characters (required)

**Success Response (201):**

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": "uuid",
    "content": "This is a great post!",
    "postId": "uuid",
    "authorId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": "uuid",
      "username": "janedoe",
      "profileImage": null
    }
  }
}
```

**Error Responses:**

- `400`: Validation error
- `401`: Unauthorized
- `404`: Post not found

---

### 4.3 Delete Comment

**DELETE** `/comments/:id`

**Description:** Delete a comment. Only the comment author can delete.

**Authentication:** Required (Bearer token)

**Path Parameters:**

- `id`: Comment ID (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Error Responses:**

- `401`: Unauthorized
- `403`: Not authorized to delete this comment
- `404`: Comment not found

---

## 5. LIKES

### 5.1 Toggle Like on Post

**POST** `/posts/:postId/like`

**Description:** Like a post if not already liked, unlike if already liked.

**Authentication:** Required (Bearer token)

**Path Parameters:**

- `postId`: Post ID (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "liked": true,
    "likeCount": 42
  }
}
```

**Error Responses:**

- `401`: Unauthorized
- `404`: Post not found

---

## 6. NOTIFICATIONS

### 6.1 Get My Notifications

**GET** `/users/me/notifications`

**Description:** Get all notifications for the authenticated user with pagination.

**Authentication:** Required (Bearer token)

**Query Parameters:**

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "LIKE",
        "message": "johndoe liked your post",
        "isRead": false,
        "actorId": "uuid",
        "postId": "uuid",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "actor": {
          "id": "uuid",
          "username": "johndoe",
          "profileImage": null
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses:**

- `401`: Unauthorized

---

### 6.2 Get Unread Notification Count

**GET** `/users/me/notifications/unread-count`

**Description:** Get the count of unread notifications.

**Authentication:** Required (Bearer token)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

**Error Responses:**

- `401`: Unauthorized

---

### 6.3 Mark Notification as Read

**PATCH** `/notifications/:id/read`

**Description:** Mark a specific notification as read.

**Authentication:** Required (Bearer token)

**Path Parameters:**

- `id`: Notification ID (UUID)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

**Error Responses:**

- `401`: Unauthorized
- `404`: Notification not found

---

### 6.4 Mark All Notifications as Read

**PATCH** `/notifications/read-all`

**Description:** Mark all notifications as read for the authenticated user.

**Authentication:** Required (Bearer token)

**Success Response (200):**

```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updatedCount": 10
  }
}
```

**Error Responses:**

- `401`: Unauthorized

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (not authorized for this action)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

---

## Rate Limiting

Authentication endpoints have rate limiting applied:

- **Auth endpoints:** 5 requests per 15 minutes per IP

---

## Data Models

### User

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "profileImage": "https://cloudinary.com/image.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Post

```json
{
  "id": "uuid",
  "title": "Post Title",
  "content": "Post content...",
  "images": ["https://cloudinary.com/image.jpg"],
  "authorId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": "uuid",
    "username": "johndoe",
    "profileImage": null
  },
  "_count": {
    "comments": 5,
    "likes": 10
  }
}
```

### Comment

```json
{
  "id": "uuid",
  "content": "Comment content",
  "postId": "uuid",
  "authorId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "author": {
    "id": "uuid",
    "username": "johndoe",
    "profileImage": null
  }
}
```

### Notification

```json
{
  "id": "uuid",
  "type": "LIKE | COMMENT",
  "message": "User action description",
  "isRead": false,
  "actorId": "uuid",
  "postId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "actor": {
    "id": "uuid",
    "username": "johndoe",
    "profileImage": null
  }
}
```

### Pagination

```json
{
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10,
  "hasNext": true,
  "hasPrev": false
}
```
