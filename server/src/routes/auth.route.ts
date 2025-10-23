import { Hono } from 'hono'
import { authController } from '@/controllers/auth.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'

const AuthRoutes = new Hono()

AuthRoutes.post('/signin', authController.signin)
AuthRoutes.post('/signup', authController.signup)
AuthRoutes.post('/signout', authMiddleware, authController.signout)

AuthRoutes.get('/me', authMiddleware, authController.me)

export default AuthRoutes