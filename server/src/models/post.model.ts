import { IPostResponseDTO } from "@/dto/post.dto"
import { prisma } from "@/lib/encryption.js"

export const postModel = {
	async findAll(page = 1, limit = 10, search = '') {
		const offset = (page - 1) * limit
		const searchTerm = `%${search}%`

		const totalItemsResult = await prisma.$queryRaw<{ count: bigint }[]>
		`
			SELECT COUNT(*)::bigint AS count
			FROM posts
			WHERE deleted_at IS NULL;
		`
		const totalItems = Number(totalItemsResult[0].count)
		const totalPages = Math.ceil(totalItems / limit)

		const posts = await prisma.$queryRaw
		`
			SELECT p.id, p.title, p.content, p.image, p.created_at, p.updated_at,
					u.id AS user_id, u.username, u.email, u.role
			FROM posts p
			JOIN users u ON p.user_id = u.id
			WHERE p.deleted_at IS NULL
			AND (p.title ILIKE ${searchTerm} OR p.content ILIKE ${searchTerm})
			ORDER BY p.created_at DESC
			LIMIT ${limit} OFFSET ${offset};
		`

		return {
			data: posts,
			meta: {
				current_page: page,
				total_page: totalPages,
				total_items: totalItems,
			},
		}
	},

	async findById(id: number) {
		const result = await prisma.$queryRaw<IPostResponseDTO[]>
		`
			SELECT p.id, p.title, p.content, p.image, p.created_at, p.updated_at,
					u.id AS user_id, u.username, u.email, u.role
			FROM posts p
			JOIN users u ON p.user_id = u.id
			WHERE p.id = ${id} AND p.deleted_at IS NULL;
		`
		return result[0]
	},

	async findByUserId(user_id: number, page = 1, limit = 10) {
		const offset = (page - 1) * limit

		const totalItemsResult = await prisma.$queryRaw<{ count: bigint }[]>
		`
			SELECT COUNT(*)::bigint AS count
			FROM posts
			WHERE user_id = ${user_id} AND deleted_at IS NULL;
		`
		const totalItems = Number(totalItemsResult[0].count)
		const totalPages = Math.ceil(totalItems / limit)

		const posts = await prisma.$queryRaw
		`
			SELECT id, title, content, image, created_at, updated_at
			FROM posts
			WHERE user_id = ${user_id} AND deleted_at IS NULL
			ORDER BY created_at DESC
			LIMIT ${limit} OFFSET ${offset};
		`

		return {
			data: posts,
			meta: {
				current_page: page,
				total_page: totalPages,
				total_items: totalItems,
			},
		}
	},

	async create(user_id: number, title: string, content: string, image?: string) {
		const result = await prisma.$queryRaw<{ id: number }[]>
		`
			INSERT INTO posts (user_id, title, content, image)
			VALUES (${user_id}, ${title}, ${content}, ${image || null})
			RETURNING id;
		`
		return result[0]
	},

	async update(id: number, title?: string, content?: string, image?: string) {
		return await prisma.$executeRaw
		`
			UPDATE posts
			SET 
				title = COALESCE(${title}, title),
				content = COALESCE(${content}, content),
				image = COALESCE(${image}, image),
				updated_at = now()
			WHERE id = ${id} AND deleted_at IS NULL;
		`
	},

	async softDelete(id: number) {
		return await prisma.$executeRaw
		`
			UPDATE posts
			SET deleted_at = now()
			WHERE id = ${id} AND deleted_at IS NULL;
		`
	},
}
