import { useMutation } from '@tanstack/react-query'
import { axiosClient, ApiResponse } from '@/lib/axios-client'
import { endpoints } from '@/utils/endpoints'

interface SignOutResponse {
    success: boolean
    message: string
}

export function useSignOutMutation() {
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosClient.post<
                ApiResponse<SignOutResponse>,
                void
            >(endpoints('signout'))
            return data
        },
    })
}
