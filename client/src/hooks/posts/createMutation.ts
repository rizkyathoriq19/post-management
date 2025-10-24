import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import ApiResponse from '@/utils/api-response'
import { endpoints } from '@/utils/endpoints'

interface CreatePostRequest {
    title: string
    content: string
    image?: File | null
}

interface CreatePostResponse {
    id: number
}

export function useCreatePostMutation() {
    return useMutation({
        mutationFn: async (payload: CreatePostRequest) => {
            const formData = new FormData()
            formData.append('title', payload.title)
            formData.append('content', payload.content)
            if (payload.image) {
                formData.append('image', payload.image)
            }

            const { data } = await axiosClient.post<
                ApiResponse<CreatePostResponse>,
                FormData
            >(endpoints('create'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return data
        },
    })
}
