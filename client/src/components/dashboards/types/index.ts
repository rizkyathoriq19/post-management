import { ReactNode } from 'react'

// Layout Types
export interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export interface HeaderProps {
    onMenuClick: () => void
    currentTheme: string
    onThemeChange: (theme: string) => void
}

export interface LayoutProps {
    children: ReactNode
}

// Card Types
export interface StatCardProps {
    title: string
    value: string
    change: string
    icon: string
    trend?: 'up' | 'down'
}

export interface ChartCardProps {
    title: string
    children: ReactNode
    actions?: ReactNode
}

export interface TableCardProps {
    title: string
    children: ReactNode
    actions?: ReactNode
}

// Post Types
export interface Post {
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

export interface PostFormData {
    title: string
    content: string
    image?: File | null
}

export interface PostsResponse {
    status: boolean
    code: number
    meta: {
        current_page: number
        total_page: number
        total_items: number
    }
    message: string
    data: Post[]
}

// Data Types
export interface UserData {
    id: number
    name: string
    email: string
    status: 'Active' | 'Inactive'
    role: string
}

export interface MenuItem {
    icon: string
    label: string
    href: string
}

export interface StatData {
    title: string
    value: string
    change: string
    icon: string
    trend?: 'up' | 'down'
}

// Table Types
export interface DataTableProps {
    onSearch: (query: string) => void
    searchQuery: string
    renderActions?: (postId: number) => React.ReactNode
}

export interface PaginationInfo {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    startIndex: number
    endIndex: number
}

export interface DeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemName: string
}

// Form Types
export interface PostFormProps {
    post?: Post | null
    onSubmit: (data: PostFormData) => void
    onCancel: () => void
    isLoading?: boolean
}

export interface EditPostPageProps {
    postId: string
}

export interface PostManagementProps {
    mode?: 'list' | 'create' | 'edit'
    postId?: string
}
