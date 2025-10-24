import { useQuery } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { endpoints } from '@/utils/endpoints'
import ApiResponse from '@/utils/api-response'

interface Post {
    id: number
    title: string
    content: string
    image: string | null
    created_at: string
    updated_at: string
    user_id: number
    username: string
    email: string
    role: string
}

export function usePostByIdQuery(id: string) {
    return useQuery({
        queryKey: ['posts', id],
        queryFn: async () => {
            const response = await axiosClient.get<ApiResponse<Post>>(
                endpoints('getById', { id })
            )
            return response.data.data
        },
    })
}
