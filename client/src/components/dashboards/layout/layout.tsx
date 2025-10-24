'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboards/layout/sidebar'
import Header from '@/components/dashboards/layout/header'
import { LayoutProps } from '../types'

export default function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const [currentTheme, setCurrentTheme] = useState<string>('light')

    // Load theme from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentTheme(savedTheme)
        document.documentElement.setAttribute('data-theme', savedTheme)
    }, [])

    const handleThemeChange = (theme: string) => {
        setCurrentTheme(theme)
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }

    return (
        <div className="bg-base-200 flex h-screen">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    currentTheme={currentTheme}
                    onThemeChange={handleThemeChange}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
