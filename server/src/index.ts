import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui';
import { PORT } from '@/utils/env.js'
import swagger from '@/swagger/index.js';
import api from '@/routes/index.js'
import "@/lib/encryption.js"

const app = new Hono()

app.use("*", poweredBy())
app.use("*", logger())
app.use("/api/v1/*", cors())

app.get('/docs', swaggerUI({ url: '/doc/openapi.json' }));
app.get('/doc/openapi.json', (c) => {
	return c.json(swagger.getOpenAPIDocument({
		openapi: '3.1.0',
		info: {
			title: 'Auth API',
			version: '1.0.0',
			description: 'API for user authentication',
		},
		servers: [
			{
				url: '{protocol}://{baseurl}/api/v1',
				description: 'Identify Server Test API',
				variables: {
				protocol: {
					default: 'http',
					enum: ['http', 'https'],
				},
				baseurl: {
					default: 'localhost:10000',
					enum: ['localhost:10000'],
				},
				}
			}
		],
	}));
});

app.route('/api/v1', api)

serve({
	fetch: app.fetch,
	port: PORT
})

console.log(`Server is running on http://localhost:${PORT}`)

export default app
