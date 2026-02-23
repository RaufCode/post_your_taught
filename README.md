# 📝 Blog Backend API

A production-grade blog platform API built with Node.js, Express, TypeScript, and PostgreSQL. Designed for high-performing students to publish intellectual content.

## 🚀 Features

- **Authentication**: JWT-based auth with access & refresh tokens, secure HTTP-only cookies
- **Authorization**: Role-based access control (Guest, Registered)
- **Posts**: Full CRUD with image uploads, pagination, view tracking
- **Comments**: Nested comments with pagination
- **Likes**: Toggle like/unlike with duplicate prevention
- **Notifications**: Real-time notifications for comments, likes, and views
- **Security**: Helmet, CORS, Rate limiting, Input validation, Password hashing
- **File Uploads**: Cloudinary-ready image upload system
- **Logging**: Structured logging with Winston
- **Type Safety**: Full TypeScript coverage with strict mode

## 🛠️ Tech Stack

- **Runtime**: Node.js (LTS)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **File Uploads**: Multer + Cloudinary
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit

## 📁 Project Structure

```
src/
 ├ config/           # Environment, database, logger config
 ├ modules/          # Feature modules
 │   ├ auth/         # Authentication (register, login, refresh, logout)
 │   ├ users/        # User management (profile, notifications)
 │   ├ posts/        # Blog posts (CRUD, images, views)
 │   ├ comments/     # Comments on posts
 │   ├ likes/        # Like/unlike posts
 │   └ notifications/ # Notification system
 ├ middleware/       # Express middleware (auth, validation, error handling)
 ├ utils/            # Utilities (pagination, JWT, errors)
 ├ types/            # TypeScript type declarations
 └ prisma/           # Database schema and migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # (Optional) Seed the database
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

The server will start at `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb?schema=public"

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (your frontend URL)
CORS_ORIGIN=http://localhost:3001

# Cloudinary (optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No (uses cookie) |
| POST | `/api/auth/logout` | Logout user | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user profile | Yes |
| PATCH | `/api/users/me` | Update user profile | Yes |
| GET | `/api/users/me/notifications` | Get user notifications | Yes |
| GET | `/api/users/me/notifications/unread-count` | Get unread count | Yes |
| PATCH | `/api/notifications/:id/read` | Mark notification as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts (paginated) | Optional |
| GET | `/api/posts/:id` | Get single post | Optional |
| POST | `/api/posts` | Create new post | Yes |
| PATCH | `/api/posts/:id` | Update own post | Yes |
| DELETE | `/api/posts/:id` | Delete own post | Yes |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts/:postId/comments` | Get post comments | No |
| POST | `/api/posts/:postId/comments` | Add comment | Yes |
| DELETE | `/api/comments/:id` | Delete own comment | Yes |

### Likes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/posts/:postId/like` | Toggle like/unlike | Yes |

## 📊 Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // Validation errors (optional)
}
```

## 🔐 Authentication Flow

1. **Register/Login**: Returns access token in response body and refresh token in HTTP-only cookie
2. **Access Token**: Include in `Authorization: Bearer <token>` header for protected routes
3. **Token Refresh**: Call `/api/auth/refresh` with refresh token cookie to get new access token
4. **Logout**: Clears refresh token cookie

## 🧪 Testing

Run the development server with auto-reload:
```bash
pnpm dev
```

Test the API with curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build image
docker build -t blog-backend .

# Run container
docker run -p 3000:3000 --env-file .env blog-backend
```

Or use docker-compose:

```bash
docker-compose up -d
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with demo data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

## 🔒 Security Features

- ✅ JWT authentication with refresh token rotation
- ✅ HTTP-only secure cookies for refresh tokens
- ✅ bcrypt password hashing (salt rounds 12+)
- ✅ Helmet for security headers
- ✅ CORS with controlled origin policy
- ✅ Rate limiting on API endpoints
- ✅ Input validation with Zod
- ✅ SQL injection prevention via Prisma ORM
- ✅ XSS protection

## 📈 Performance Optimizations

- ✅ Database indexing on foreign keys
- ✅ Selective field queries in Prisma
- ✅ Pagination on all list endpoints
- ✅ Efficient notification batching
- ✅ Connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ for high-performing students
