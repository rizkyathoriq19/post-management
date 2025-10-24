import { z } from "zod"

export const PostCreateSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	image: z.string().optional(),
})

export const PutUpdateSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	image: z.string().optional(),
})

export type CreateSchema = z.infer<typeof PostCreateSchema>
export type UpdateSchema = z.infer<typeof PutUpdateSchema>

export interface IPostResponseDTO {
	id: number
	title: string
	content: string
	image?: string | null
	created_at: Date
	updated_at: Date
	user_id: number
	username: string
	email: string
	role: string
}

export interface IPaginationMeta {
	current_page: number
	total_page: number
	total_items: number
}

export interface IPaginatedPostResponse {
	data: IPostResponseDTO[]
	meta: IPaginationMeta
}
