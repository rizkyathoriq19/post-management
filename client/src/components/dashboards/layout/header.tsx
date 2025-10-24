'use client'

import { useRouter } from 'next/navigation'
import { useSignOutMutation } from '@/hooks/auth/logoutMutation'
import { HeaderProps } from '../types'

export default function Header({
    onMenuClick,
    currentTheme,
    onThemeChange,
}: HeaderProps) {
    const router = useRouter()
    const { mutateAsync: signOut, isPending } = useSignOutMutation()

    const toggleTheme = () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light'
        onThemeChange(newTheme)
    }

    const handleLogout = async () => {
        try {
            await signOut()
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            router.replace('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <header className="bg-base-100 border-base-300 border-b shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="btn btn-ghost btn-sm mr-2 lg:hidden"
                    >
                        ☰
                    </button>
                    <h2 className="text-base-content text-lg font-semibold">
                        Dashboard Overview
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost btn-circle"
                        title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {currentTheme === 'light' ? (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        )}
                    </button>

                    {/* Notifications */}
                    <button className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <span className="text-lg">🔔</span>
                            <span className="badge badge-xs badge-primary indicator-item"></span>
                        </div>
                    </button>

                    {/* User Dropdown */}
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="bg-primary text-primary-content flex w-8 items-center justify-center rounded-full text-xs">
                                AU
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow"
                        >
                            <li>
                                <a>Profile</a>
                            </li>
                            <li>
                                <a>Settings</a>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Logging out...
                                        </>
                                    ) : (
                                        'Logout'
                                    )}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}
