import { Context, Hono } from "hono"
import RoutesRegistry from "./registry"
import { res } from "@/utils/response"

const api = new Hono()

// Health check
api.get("/ping", async (c: Context)  => {
	return res(c, "getDetail", 200, "pong");
});

// Modular routes
api.route("/auth", RoutesRegistry.AuthRoutes)
api.route("/post", RoutesRegistry.PostRoutes)

api.all("*", async (c: Context) => {
	return res(c, "err", 404, "Route not found")
})

export default api
