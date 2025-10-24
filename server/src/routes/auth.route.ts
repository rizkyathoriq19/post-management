import { Hono } from 'hono'
import { authController } from '@/controllers/auth.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { LoginSchema, RegisterSchema } from '@/dto/auth.dto'
import { validateMiddleware } from '@/middlewares/validate.middleware'

const AuthRoutes = new Hono()

AuthRoutes.post('/signin', validateMiddleware(LoginSchema), authController.signin)
AuthRoutes.post('/signup', validateMiddleware(RegisterSchema), authController.signup)
AuthRoutes.post('/signout', authMiddleware, authController.signout)

AuthRoutes.get('/me', authMiddleware, authController.me)

export default AuthRoutes