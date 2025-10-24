import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { endpoints } from '@/utils/endpoints'
import ApiResponse from '@/utils/api-response'

interface UpdatePostRequest {
    id: string
    title: string
    content: string
    image?: File | null
}

interface UpdatePostResponse {
    id?: number
}

export function useUpdatePostMutation() {
    return useMutation({
        mutationFn: async (payload: UpdatePostRequest) => {
            const formData = new FormData()
            formData.append('title', payload.title)
            formData.append('content', payload.content)
            if (payload.image) {
                formData.append('image', payload.image)
            }

            const { data } = await axiosClient.put<
                ApiResponse<UpdatePostResponse>,
                FormData
            >(endpoints('update', { id: payload.id }), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return data
        },
    })
}
