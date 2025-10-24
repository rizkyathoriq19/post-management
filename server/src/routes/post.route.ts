import { Hono } from 'hono'
import { postController } from '@/controllers/post.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { validateMiddleware } from '@/middlewares/validate.middleware'
import { PostCreateSchema, PutUpdateSchema } from '@/dto/post.dto'
import { uploadSingle } from '@/middlewares/upload.middleware'

const PostRoutes = new Hono()

PostRoutes.get('/all', authMiddleware, postController.getAll)
PostRoutes.post('/create', uploadSingle("image"), authMiddleware, postController.create)

PostRoutes.get('/detail/:id', authMiddleware, postController.getById)
PostRoutes.put('/update/:id', uploadSingle("image"), authMiddleware, postController.update)
PostRoutes.delete('/delete/:id', authMiddleware, postController.delete)

export default PostRoutes