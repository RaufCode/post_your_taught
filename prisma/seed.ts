import { prisma } from "../src/config/database.ts";
import bcrypt from "bcryptjs";
import { env } from "../src/config/env.ts";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Create demo users
  const hashedPassword = await bcrypt.hash("password123", env.BCRYPT_SALT_ROUNDS);

  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      username: "alice",
      password: hashedPassword,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      username: "bob",
      password: hashedPassword,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "charlie@example.com",
      username: "charlie",
      password: hashedPassword,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
    },
  });

  console.log("👤 Created 3 demo users");

  // Create demo posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with TypeScript",
      content:
        "TypeScript is a powerful superset of JavaScript that adds static type checking. In this post, we'll explore the basics of TypeScript and how it can improve your development workflow...",
      images: [
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
      ],
      authorId: user1.id,
      viewCount: 42,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Building Scalable APIs with Express",
      content:
        "Express.js is a minimal and flexible Node.js web application framework. Today, I'll share best practices for building scalable and maintainable APIs...",
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      ],
      authorId: user2.id,
      viewCount: 28,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Database Design with Prisma",
      content:
        "Prisma is a next-generation ORM that makes working with databases easy. Let's dive into schema design, migrations, and best practices...",
      images: [
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
      ],
      authorId: user1.id,
      viewCount: 15,
    },
  });

  console.log("📝 Created 3 demo posts");

  // Create comments
  const comment1 = await prisma.comment.create({
    data: {
      content: "Great introduction to TypeScript! Thanks for sharing.",
      authorId: user2.id,
      postId: post1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: "This is exactly what I needed. Very helpful!",
      authorId: user3.id,
      postId: post1.id,
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: "Could you elaborate on error handling patterns?",
      authorId: user1.id,
      postId: post2.id,
    },
  });

  console.log("💬 Created 3 demo comments");

  // Create likes
  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user3.id,
      postId: post1.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post2.id,
    },
  });

  console.log("❤️ Created 3 demo likes");

  // Create notifications
  await prisma.notification.create({
    data: {
      type: "COMMENT",
      actorId: user2.id,
      recipientId: user1.id,
      postId: post1.id,
      commentId: comment1.id,
    },
  });

  await prisma.notification.create({
    data: {
      type: "LIKE",
      actorId: user2.id,
      recipientId: user1.id,
      postId: post1.id,
    },
  });

  console.log("🔔 Created 2 demo notifications");

  console.log("\n✅ Seed completed successfully!");
  console.log("\nDemo accounts:");
  console.log("  alice@example.com / password123");
  console.log("  bob@example.com / password123");
  console.log("  charlie@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
