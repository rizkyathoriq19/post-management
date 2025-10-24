import path from "path"
import fs from "fs"
import type { Context, Next } from "hono"
import { randomBytes } from "crypto"

const uploadDir = path.join(process.cwd(), "src", "uploads")
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true })
}

const generateFilename = (originalName: string): string => {
	const uniqueSuffix = Date.now() + "-" + randomBytes(6).toString("hex")
	const ext = path.extname(originalName)
	const baseName = path.basename(originalName, ext)
	return `${baseName}-${uniqueSuffix}${ext}`
}

export const uploadSingle = (
	fieldName: string, 
	options?: {
		required?: boolean
		maxSize?: number
		allowedTypes?: string[]
	}
) => {
	const required = options?.required ?? false
	const maxSize = options?.maxSize || 5 * 1024 * 1024 // 5MB
	const allowedTypes = options?.allowedTypes || [
		"image/jpeg", 
		"image/png", 
		"image/jpg", 
		"image/gif", 
		"image/webp"
	]

	return async (c: Context, next: Next) => {
		try {
			const body = await c.req.parseBody()
			
			const file = body[fieldName]
			
			const bodyFields: Record<string, any> = {}
			for (const [key, value] of Object.entries(body)) {
				if (key !== fieldName) {
					bodyFields[key] = value
				}
			}
			c.set("body", bodyFields)
			
			if (!file) {
				if (required) {
					return c.json({ 
						error: `${fieldName} is required` 
					}, 400)
				}
				await next()
				return
			}
			
			if (!(file instanceof File)) {
				return c.json({ 
					error: `Invalid ${fieldName} format` 
				}, 400)
			}
			
			if (file.size > maxSize) {
				return c.json({ 
					error: `Image too large. Maximum size: ${maxSize / 1024 / 1024}MB` 
				}, 400)
			}
			
			if (!allowedTypes.includes(file.type)) {
				return c.json({ 
					error: `Invalid image type. Allowed types: ${allowedTypes.map(t => t.replace('image/', '')).join(", ")}` 
				}, 400)
			}
			
			const filename = generateFilename(file.name)
			const filepath = path.join(uploadDir, filename)
			
			const arrayBuffer = await file.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)
			fs.writeFileSync(filepath, buffer)
			
			
			const fileInfo: UploadedFile = {
				fieldname: fieldName,
				originalname: file.name,
				filename: filename,
				path: filepath,
				mimetype: file.type,
				size: file.size,
			}
			
			c.set("file", fileInfo)
			
			await next()
		} catch (error: any) {
			console.error("❌ Upload error:", error)
			return c.json({ 
				error: error.message || "Image upload failed" 
			}, 500)
		}
	}
}

export interface UploadedFile {
	fieldname: string
	originalname: string
	filename: string
	path: string
	mimetype: string
	size: number
}

export const getUploadedFile = (c: Context): UploadedFile | undefined => {
	return c.get("file")
}

export const getFormData = (c: Context): Record<string, any> => {
	return c.get("body") || {}
}

export const deleteFile = (filename: string): boolean => {
	try {
		const filepath = path.join(uploadDir, filename)
		if (fs.existsSync(filepath)) {
			fs.unlinkSync(filepath)
			console.log("🗑️ File deleted:", filename)
			return true
		}
		return false
	} catch (error) {
		console.error("Error deleting file:", error)
		return false
	}
}