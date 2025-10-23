import { OpenAPIHono } from "@hono/zod-openapi"

const swagger = new OpenAPIHono()

swagger.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
    type: 'http',
    scheme: 'bearer'
})


export default swagger