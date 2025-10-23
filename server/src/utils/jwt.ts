import { sign, verify } from 'hono/jwt'
import { SECRET, REFRESH_SECRET } from '@/utils/env.js'
import { IUserToken } from '@/dto/auth.dto';

export const generateToken = async (user: IUserToken) => {
    const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 3);
    const token = await sign({ ...user, exp: expiresIn }, SECRET)
	return {
		token: token,
		expiresAt: new Date(expiresIn * 1000)
	}
}

export const refreshGenerateToken = async (user: IUserToken) => { 
    const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7);
    const token = await sign({ ...user, exp: expiresIn }, REFRESH_SECRET)
    return {
		token: token,
		expiresAt: new Date(expiresIn * 1000)
	}
}

export const getUserData = async (token: string): Promise<IUserToken> => {
    const user = await verify(token, SECRET).catch(() => null)
    if (!user) throw new Error('Invalid token')
    return user as IUserToken
}

export const refreshAccessToken = async (refreshToken: string) => {
    const decoded = await verify(refreshToken, REFRESH_SECRET).catch(() => null) as IUserToken
    if (!decoded) throw new Error('Invalid refresh token')

    const newAccessToken = generateToken({ id: decoded.id, role: decoded.role })
    return newAccessToken
}