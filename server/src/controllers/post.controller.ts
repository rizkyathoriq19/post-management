import { Context } from "hono"
import { res } from "@/utils/response"
import { postModel } from "@/models/post.model"
import { PostCreateSchema, PutUpdateSchema } from "@/dto/post.dto"
import { deleteFile, getFormData, getUploadedFile } from "@/middlewares/upload.middleware"
import { ZodError } from "zod"

export const postController = {
	async getAll(c: Context) {
		try {
			const page = Number(c.req.query("page") || 1)
			const limit = Number(c.req.query("limit") || 10)
			const search = String(c.req.query("search") || "")

			const user = c.get("user")
			if (!user) return res(c, "err", 401, "Unauthorized")
	
			const result = await postModel.findAll(page, limit, search)
			return res(c, "get", 200, "Posts fetched successfully",
				result.data,
				result.meta.current_page,
				result.meta.total_page,
				result.meta.total_items
			)
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async getById(c: Context) {
		try {
			const id = Number(c.req.param("id"))
			const user = c.get("user")
			if (!user) return res(c, "err", 401, "Unauthorized")
	
			const result = await postModel.findById(id)
			if (!result) return res(c, "err", 404, "Post not found")
				
			return res(c, "getDetail", 200, "Post fetched successfully", result)
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async getByUser(c: Context) {
		try {
			const user = c.get("user")
			if (!user) return res(c, "err", 401, "Unauthorized")

			const page = Number(c.req.query("page") || 1)
			const limit = Number(c.req.query("limit") || 10)
	
			const result = await postModel.findByUserId(user.id, page, limit)
			return res(c, "get", 200, "User posts fetched successfully",
				result.data,
				result.meta.current_page,
				result.meta.total_page,
				result.meta.total_items
			)
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async create(c: Context) {
		const file = getUploadedFile(c)
		try {
			const user = c.get("user")
			if (!user) return res(c, "err", 401, "Unauthorized")

			const formData = getFormData(c)
			
			const validatedData = PostCreateSchema.parse({
				title: formData.title,
				content: formData.content,
				image: file?.filename,
			})

			const post = await postModel.create(
				user.id, 
				validatedData.title, 
				validatedData.content, 
				validatedData.image || ''
			)
			
			return res(c, "post", 201, "Post created successfully", post)
		} catch (error) {
			if (file) deleteFile(file.filename)
			
			if (error instanceof ZodError) {
				const formattedErrors = error.issues.map(issue => ({
					field: issue.path.join("."),
					message: issue.message
				}))
				return res(c, "err", 400, formattedErrors[0].message)
			}
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async update(c: Context) {
		const file = getUploadedFile(c)
		try {
			const user = c.get("user")
			if (!user) return res(c, "err", 401, "Unauthorized")

			const id = Number(c.req.param("id"))

			const existingPost = await postModel.findById(id)
			if (!existingPost) {
				return res(c, "err", 404, "Post not found")
			}

			if (existingPost.user_id !== user.id) {
				return res(c, "err", 403, "Forbidden: You can only update your own posts")
			}
			
			const formData = getFormData(c)

			const validatedData = PutUpdateSchema.parse({
				title: formData.title || existingPost.title,
				content: formData.content || existingPost.content,
				image: file?.filename || existingPost.image,
			})

			if (file && existingPost.image) {
				deleteFile(existingPost.image)
			}

			await postModel.update(
				id, 
				validatedData.title, 
				validatedData.content, 
				validatedData.image || ''
			)
			
			return res(c, "put", 200, "Post updated successfully")
		} catch (error) {
			if (file) deleteFile(file.filename)
			
			if (error instanceof ZodError) {
				const formattedErrors = error.issues.map(issue => ({
					field: issue.path.join("."),
					message: issue.message
				}))
				return res(c, "err", 400, formattedErrors[0].message)
			}
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},

	async delete(c: Context) {
		try {
			const id = Number(c.req.param("id"))
			const user = c.get("user")
			if (!user) return res(c, "err", 401, "Unauthorized")

			await postModel.softDelete(id)
			return res(c, "delete", 200, "Post deleted successfully")
		} catch (error) {
			return res(c, "err", 500, error instanceof Error ? error.message : "Internal server error")
		}
	},
}
