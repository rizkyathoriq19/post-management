import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
	console.log("🌱 Starting database seeding...")

	await prisma.userSession.deleteMany({})
	await prisma.post.deleteMany({})
	await prisma.user.deleteMany({})

	const admin = await prisma.user.create({
		data: {
		username: "admin",
		email: "admin@example.com",
		password: "admin123",
		role: "admin",
		},
	})

	console.log(`✅ Created admin user: ${admin.username}`)

	const postsData = [
		{
		user_id: admin.id,
		title: "Welcome to the Blog",
		content: "This is the first post by admin.",
		image: null,
		},
		{
		user_id: admin.id,
		title: "Another Admin Post",
		content: "Some content for the second post.",
		image: null,
		},
	]

	for (const post of postsData) {
		const createdPost = await prisma.post.create({ data: post })
		console.log(`📰 Created post: ${createdPost.title}`)
	}

	const session = await prisma.userSession.create({
		data: {
			user_id: admin.id,
			token: "dummy_access_token",
			refresh_token: "dummy_refresh_token",
			ip_address: "127.0.0.1",
			user_agent: "Seeder Script",
		},
	})

	console.log(`🔑 Created dummy session ID: ${session.id}`)
	console.log("✅ Seeding completed successfully!")
}

main()
	.catch((e) => {
		console.error("❌ Seeding failed:", e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
