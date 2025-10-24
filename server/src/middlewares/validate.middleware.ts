import { ZodError, ZodType } from "zod"
import { Context, Next } from "hono"
import { res } from "@/utils/response"

export const validateMiddleware = <T>(schema: ZodType<T>) =>
	async (c: Context, next: Next) => {
		try {
			let data: Record<string, any> = {}

			const contentType = c.req.header("content-type")?.toLowerCase() || ""

			if (contentType.includes("application/json")) {
				data = await c.req.json()
			} else if (
				contentType.includes("multipart/form-data") ||
				contentType.includes("application/x-www-form-urlencoded")
			) {
				const form = await c.req.parseBody()
				for (const key in form) {
					const val = form[key]
					if (typeof val === "object" && "name" in val) {
						data[key] = val.name
					} else {
						data[key] = val?.toString?.() || ""
					}
				}
			} else {
				return res(c, "err", 415, "Unsupported Content-Type")
			}

			const parsed = schema.parse(data)
			c.set("validatedBody", parsed)

			await next()
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = error.issues.map((e) => ({
					field: e.path.join("."),
					message: e.message,
				}))
				return res(c, "err", 400, "Validation failed", errors)
			}

			return res(
				c,
				"err",
				500,
				error instanceof Error ? error.message : "Internal server error"
			)
		}
	}
