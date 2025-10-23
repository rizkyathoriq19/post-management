import { Context, Next } from "hono"
import { getUserData } from "@/utils/jwt.js"
import { authModel } from "@/models/auth.model"
import type { MiddlewareHandler } from "hono"
import type { IUserToken } from "@/dto/auth.dto"

export const authMiddleware: MiddlewareHandler<{ Variables: { user: IUserToken } }> = async (
	c: Context, 
	next: Next
) => {
	const token = c.req.header("Authorization")?.replace("Bearer ", "")
	const refreshToken = c.req.header("x-refresh-token")

	if (!token || !refreshToken)
		return c.json({ status: false, message: "Unauthorized" }, 401)

	const user = await getUserData(token).catch(() => null)
	if (!user) return c.json({ status: false, message: "Invalid access token" }, 401)

	const session = await authModel.findSession(refreshToken)
	if (!session || session.is_revoked) {
		return c.json({ status: false, message: "Session expired or revoked" }, 401)
	}

	c.set("user", user)
	c.set("token", { accessToken: token, refreshToken })
	await next()
}
