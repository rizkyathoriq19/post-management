export interface ILoginDTO {
	identifier: string
	password: string
}

export interface IRegisterDTO {
	username: string
	email: string
	password: string
	role?: "user" | "admin"
}

export interface IAuthResponseDTO {
	user: {
		id: number
		username: string
		email: string
		role: "user" | "admin"
	}
	token: {
		accessToken: string
		refreshToken: string
		expiresAt: Date
	}
}

export interface IUserToken {
	id: number
	role: "user" | "admin"
	exp?: number
	[key: string]: any
}
