import { Context } from "hono"
import { ContentfulStatusCode } from "hono/utils/http-status"

export const res = (
	c: Context,
	method: string,
	statusCode: ContentfulStatusCode,
	message = "",
	data: any = {},
	c_page = 0,
	t_page = 0,
	t_items = 0
) => {
	const status = [200, 201].includes(statusCode)
	const errorResponse = c.json(
		{
			status,
			code: statusCode,
			error: message,
		}, statusCode
	)

	switch (method) {
		case "get":
			return c.json(
				{
					status,
					code: statusCode,
					meta: {
						current_page: c_page,
						total_page: t_page,
						total_items: t_items,
					},
					message,
					data,
				}, statusCode
			)

		case "getDetail":
		case "login":
		case "postBatch":
			return c.json(
				{
					status,
					code: statusCode,
					message,
					data,
				}, statusCode
			)

		case "post":
		case "put":
		case "patch":
		case "delete":
			return c.json(
				{
					status,
					code: statusCode,
					message,
					data,
				}, statusCode
			)

		case "err":
			return errorResponse

		default:
			return c.json(
				{
					status: false,
					code: 500,
					error: "Invalid response method",
				},500
			)
	}
}
