'use client'

import { TableCardProps } from '../types'

export default function TableCard({
    title,
    children,
    actions,
}: TableCardProps) {
    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4 md:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base-content text-lg font-semibold">
                        {title}
                    </h3>
                    {actions && <div className="flex space-x-2">{actions}</div>}
                </div>
                {children}
            </div>
        </div>
    )
}
