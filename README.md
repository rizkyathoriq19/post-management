# Post Management 

## Tech Stack
| **Layer**                            | **Technology Stack**                                       | **Purpose / Reasoning**                                                                                                                            |
| ------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend Framework**               | **Next.js 16**                                             | Modern fullstack React framework supporting App Router, Server Actions, SSR, and API routes. Enables scalable and high-performance UI development. |
| **Styling**                          | **Tailwind CSS 4 + DaisyUI 5**                             | Utility-first CSS framework with component-based UI library for rapid design, theme consistency, and responsive layouts.                           |
| **Data Fetching & State Management** | **TanStack Query (React Query)**                           | Handles asynchronous data fetching, caching, and revalidation automatically, reducing boilerplate and improving performance.                       |
| **HTTP Client**                      | **Axios**                                                  | Simplified API calls with support for interceptors, error handling, and cleaner request configuration.                                             |
| **Backend Framework**                | **Hono**                                                   | Lightweight, fast, and web-standard framework ideal for edge and serverless environments.                                                          |
| **Database**                         | **PostgreSQL**                                             | Reliable, open-source relational database that supports complex queries and scalable schema design.                                                |
| **ORM (Object Relational Mapper)**   | **Prisma ORM**                                             | Type-safe ORM with auto-generated client, simple schema definition, and powerful migration tools.                                                  |
| **Validation Layer**                 | **Zod / DTO Schema**                                       | Ensures type safety and request validation across API layers.                                                                                      |
| **Architecture Pattern**             | **Clean Architecture (Controller → Service → Repository)** | Separates responsibilities clearly for better maintainability, scalability, and testability.                                                       |

## Steps To Run Project Locally

Clone Repository :
```
git clone https://github.com/rizkyathoriq19/post-management
cd post-management
```

Install dependencies client:

```
cd client
pnpm install
```

Install dependencies server:

```
cd server
npm install
```

Setup Environment :

```
cp .example.env .env    # client
cp .env.example .env    # server
```
Get .env value, and change all configuration in .env at client
```
NEXT_PUBLIC_API_URL=http://localhost:10000
```
and server
```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
DATABASE_SSL=false

NODE_ENV=development
PORT=10000

SECRET="secret_key"
REFRESH_SECRET="refresh_secret_key"
```
## Running The App 


By Default, to run the app with hot-reload simply run client
```
pnpm run dev
```
and server
```
npm run dev
```

## API Auth Endpoints  

| Method | Endpoint                       | Description                 | Access  |
|--------|--------------------------------|-----------------------------|---------|
| POST   | `/api/v1/auth/signin`          | Login                       | Public  |
| POST   | `/api/v1/auth/signup`          | Register                    | Public  |
| POST   | `/api/v1/auth/signout`         | Logout                      | Token  |


## API Post Endpoints  

| Method | Endpoint                       | Description                 | Access  |
|--------|--------------------------------|-----------------------------|---------|
| GET    | `/api/v1/post/all`             | Get All Posts               | Token  |
| GET    | `/api/v1/post/detail/:id`      | Get Post By ID              | Token  |
| POST   | `/api/v1/post/create`          | Create Post                 | Token  |
| PUT    | `/api/v1/post/update/:id`      | Update Post by ID           | Token  |
| DELETE | `/api/v1/post/delete/:id`      | Update Post By ID           | Token  |
