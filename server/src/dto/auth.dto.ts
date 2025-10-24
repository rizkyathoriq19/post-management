import { z } from "zod"

export const LoginSchema = z.object({
	identifier: z
		.string("Identifier (email or username) is required")
		.min(3, "Identifier must be at least 3 characters"),
	password: z
		.string("Password is required" )
		.min(6, "Password must be at least 6 characters"),
})

export const RegisterSchema = z.object({
	username: z.string("Username is required")
		.min(3, "Username must be at least 3 characters"),
	email: z.email("Invalid email format").refine(value => value, {
		message: "Email is required",
	}),
	password: z
		.string("Password is required")
		.min(6, "Password must be at least 6 characters"),
	role: z.enum(["user", "admin"]).default("user"),
})

export const AuthResponseSchema = z.object({
	user: z.object({
		id: z.number(),
		username: z.string(),
		email: z.email("Invalid email format").refine(value => value, {
		message: "Email is required",
		}),
		role: z.enum(["user", "admin"]),
	}),
	token: z.object({
		access_token: z.string(),
		refresh_token: z.string(),
		expires_at: z.date(),
	}),
})

export const UserTokenSchema = z.object({
	id: z.number(),
	role: z.enum(["user", "admin"]),
	exp: z.number().optional(),
})

export type ILoginDTO = z.infer<typeof LoginSchema>
export type IRegisterDTO = z.infer<typeof RegisterSchema>
export type IAuthResponseDTO = z.infer<typeof AuthResponseSchema>
export type IUserToken = z.infer<typeof UserTokenSchema>
