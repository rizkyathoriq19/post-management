import { ILoginDTO, IRegisterDTO } from "@/dto/auth.dto.js"
import { prisma } from "@/lib/encryption.js"

export const authModel = {
	async signin(req: ILoginDTO) {
		return await prisma.$queryRaw<
		{ id: number; username: string; email: string; role: string }[]
		>`
			SELECT id, username, email, role
			FROM users 
			WHERE (email = ${req.identifier} OR username = ${req.identifier})
			AND password = crypt(${req.password}, password);
		`
	},

	async signup(req: IRegisterDTO) {
		return await prisma.$executeRaw
		`
			INSERT INTO users (username, email, password, role)
			VALUES (${req.username}, ${req.email}, ${req.password}, ${req.role || "user"});
		`
	},

	async findByEmail(email: string) {
		return await prisma.$queryRaw<{ id: number; email: string }[]>
		`
			SELECT id, email FROM users WHERE email = ${email};
		`
	},

	async findById(id: number) {
		const result = await prisma.$queryRaw<
		{ id: number; username: string; email: string; role: string }[]
		>`
			SELECT id, username, email, role FROM users WHERE id = ${id};
		`
		return result[0]
	},

	async createSession(user_id: number, token: string, refreshToken: string, ip?: string, ua?: string) {
		return await prisma.$executeRaw
		`
			INSERT INTO user_sessions (user_id, token, refresh_token, ip_address, user_agent)
			VALUES (${user_id}, ${token}, ${refreshToken}, ${ip || ""}, ${ua || ""});
		`
	},

	async revokeSession(refreshToken: string) {
		return await prisma.$executeRaw
		`
			UPDATE user_sessions 
			SET is_revoked = true, revoked_at = now()
			WHERE refresh_token = ${refreshToken};
		`
	},

	async findSession(refreshToken: string) {
		const session = await prisma.$queryRaw<{ is_revoked: boolean }[]>
		`
			SELECT is_revoked FROM user_sessions WHERE refresh_token = ${refreshToken};
		`
		return session[0]
	},
}
