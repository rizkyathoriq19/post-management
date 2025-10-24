'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token')

        if (!accessToken) {
            router.replace('/login')
            return
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAuthenticated(true)
    }, [router])

    if (isAuthenticated === null) {
        return (
            <div className="bg-base-200 flex min-h-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    return <>{children}</>
}
