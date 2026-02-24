import { prisma } from "../../config/database.js";
import bcrypt from "bcryptjs";
import { env } from "../../config/env.js";
export class AuthRepository {
    async findUserByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    async findUserByUsername(username) {
        return prisma.user.findUnique({
            where: { username },
        });
    }
    async findUserById(id) {
        return prisma.user.findUnique({
            where: { id },
        });
    }
    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);
        return prisma.user.create({
            data: {
                email: data.email,
                username: data.username,
                password: hashedPassword,
            },
        });
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async createRefreshToken(data) {
        return prisma.refreshToken.create({
            data,
        });
    }
    async findRefreshToken(token) {
        return prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
    }
    async deleteRefreshToken(token) {
        await prisma.refreshToken.deleteMany({
            where: { token },
        });
    }
    async deleteAllUserRefreshTokens(userId) {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    async revokeExpiredRefreshTokens() {
        await prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
}
export const authRepository = new AuthRepository();
//# sourceMappingURL=repository.js.map