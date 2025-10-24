import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { endpoints } from '@/utils/endpoints'
import ApiResponse from '@/utils/api-response'

interface DeletePostResponse {
    success: boolean
    message: string
}

export function useDeletePostMutation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axiosClient.delete<
                ApiResponse<DeletePostResponse>
            >(endpoints('delete', { id }))
            return data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },

        onError: error => {
            console.error('❌ Failed to delete post:', error)
        },
    })
}
