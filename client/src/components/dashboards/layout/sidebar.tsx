'use client'

import { SidebarProps, MenuItem } from '../types'

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const menuItems: MenuItem[] = [
        { icon: '📝', label: 'Post Management', href: '#' },
    ]

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`bg-base-100 fixed inset-y-0 left-0 z-50 w-64 transform shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:inset-0 lg:translate-x-0`}
            >
                <div className="border-base-300 flex h-16 items-center justify-between border-b px-4">
                    <h1 className="text-primary text-xl font-bold">
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                <nav className="mt-6">
                    <ul className="space-y-2 px-4">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="text-base-content hover:bg-base-300 flex items-center rounded-lg px-4 py-3 transition-colors duration-200"
                                >
                                    <span className="mr-3 text-lg">
                                        {item.icon}
                                    </span>
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}
