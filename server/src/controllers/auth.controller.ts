import type { Context } from "hono"
import { generateToken, refreshGenerateToken, getUserData } from "@/utils/jwt.js"
import { authModel } from "@/models/auth.model"
import { res } from "@/utils/response"
import type { IAuthResponseDTO, ILoginDTO, IRegisterDTO } from "@/dto/auth.dto"

export const authController = {
	async signin(c: Context) {
		const body = await c.req.json<ILoginDTO>()

		try {
			const user = await authModel.signin(body)
			if (user.length === 0) {
				return res(c, "err", 404, "Invalid email or password")
			}

			const u = user[0]

			const accessToken = await generateToken({ id: u.id, role: u.role as "user" | "admin" })
			const refreshToken = await refreshGenerateToken({ id: u.id, role: u.role as "user" | "admin" })

			const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || ""
			const ua = c.req.header("user-agent") || ""
			await authModel.createSession(u.id, accessToken.token, refreshToken.token, ip, ua)

			const result: IAuthResponseDTO = {
				user: {
					id: u.id,
					username: u.username,
					email: u.email,
					role: u.role as "admin" | "user",
				},
				token: {
					access_token: accessToken.token,
					refresh_token: refreshToken.token,
					expires_at: accessToken.expires_at,
				},
			}

			return res(c, "login", 200, "Login successful", result)
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async signup(c: Context) {
		const body = await c.req.json<IRegisterDTO>()
		
		try {
			const existing = await authModel.findByEmail(body.email)
			if (existing.length > 0) return res(c, "err", 400, "Email already registered")

			const user = await authModel.signup(body)
			return res(c, "post", 201, "Signup successful", user)
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async me(c: Context) {
		try {
			const user = c.get("user")

			const userData = await authModel.findById(user.id)
			return res(c, "getDetail", 200, "User data fetched successfully", userData)
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async signout(c: Context) {
		try {
			const refreshToken = c.get("token").refresh_token

			await authModel.revokeSession(refreshToken)
			return res(c, "post", 200, "Signout successful")
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},
}
