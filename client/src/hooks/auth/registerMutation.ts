import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { endpoints } from '@/utils/endpoints'
import ApiResponse from '@/utils/api-response'

interface RegisterRequest {
    username: string
    email: string
    password: string
}

interface RegisterResponse {
    id?: number
}

export function useRegisterMutation() {
    return useMutation({
        mutationFn: async (payload: RegisterRequest) => {
            const { data: response } = await axiosClient.post<
                ApiResponse<RegisterResponse>,
                RegisterRequest
            >(endpoints('signup'), payload)
            return response.data
        },
    })
}
