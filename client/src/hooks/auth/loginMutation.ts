import { useMutation } from '@tanstack/react-query'
import { axiosClient } from '@/lib/axios-client'
import { endpoints } from '@/utils/endpoints'
import ApiResponse from '@/utils/api-response'

interface LoginRequest {
    identifier: string
    password: string
}

interface LoginResponse {
    user: {
        id: number
        username: string
        email: string
        role: string
    }
    token: {
        access_token: string
        refresh_token: string
        expires_at: Date
    }
}

export function useLoginMutation() {
    return useMutation({
        mutationFn: async (payload: LoginRequest) => {
            const { data: response } = await axiosClient.post<
                ApiResponse<LoginResponse>,
                LoginRequest
            >(endpoints('signin'), payload)
            return response.data
        },
        onSuccess: data => {
            localStorage.setItem(
                'access_token',
                data?.token?.access_token ?? ''
            )
            localStorage.setItem(
                'refresh_token',
                data?.token?.refresh_token ?? ''
            )
        },
    })
}
