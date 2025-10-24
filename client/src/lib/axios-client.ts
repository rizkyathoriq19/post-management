import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios'

interface ApiResponse<T = unknown> {
    data: T
    status: number
    message: string
}

class AxiosClient {
    private static instance: AxiosClient
    private axiosInstance: AxiosInstance

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL:
                process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        this.setupInterceptors()
    }

    public static getInstance(): AxiosClient {
        if (!AxiosClient.instance) {
            AxiosClient.instance = new AxiosClient()
        }
        return AxiosClient.instance
    }

    private setupInterceptors(): void {
        this.axiosInstance.interceptors.request.use(
            config => {
                const token = localStorage.getItem('access_token')
                const refreshToken = localStorage.getItem('refresh_token')

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }

                if (refreshToken) {
                    config.headers['x-refresh-token'] = refreshToken
                }
                return config
            },
            (error: AxiosError) => {
                return Promise.reject(error)
            }
        )

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response
            },
            (error: AxiosError) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            localStorage.removeItem('access_token')
                            window.location.href = '/login'
                            break
                        case 403:
                            // Handle forbidden
                            break
                        case 404:
                            // Handle not found
                            break
                        case 500:
                            // Handle server error
                            break
                    }
                }
                return Promise.reject(error)
            }
        )
    }

    public async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<T>(url, config)
            return {
                data: response.data,
                status: response.status,
                message: 'Success',
            }
        } catch (error) {
            throw this.handleError(error as Error)
        }
    }

    public async post<T, U>(
        url: string,
        data?: U,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<T>(url, data, config)
            return {
                data: response.data,
                status: response.status,
                message: 'Success',
            }
        } catch (error) {
            throw this.handleError(error as Error)
        }
    }

    public async put<T, U>(
        url: string,
        data?: U,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.put<T>(url, data, config)
            return {
                data: response.data,
                status: response.status,
                message: 'Success',
            }
        } catch (error) {
            throw this.handleError(error as Error)
        }
    }

    public async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.delete<T>(url, config)
            return {
                data: response.data,
                status: response.status,
                message: 'Success',
            }
        } catch (error) {
            throw this.handleError(error as Error)
        }
    }

    private handleError(error: Error): Error {
        if (error instanceof AxiosError) {
            return new Error(error.response?.data?.message || error.message)
        }
        return error
    }
}

// Export a singleton instance
export const axiosClient = AxiosClient.getInstance()

// Export types
export type { ApiResponse }
