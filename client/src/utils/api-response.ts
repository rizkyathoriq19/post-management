interface ApiResponse<T = void> {
    code: number
    status: boolean
    message: string
    errors?: string[] | null
    data?: T | null
    meta?: {
        current_page: number
        total_page: number
        total_items: number
    }
}

export default ApiResponse
