'use client'

import { StatCardProps } from '../types'

export default function StatCard({
    title,
    value,
    change,
    icon,
    trend = 'up',
}: StatCardProps) {
    const trendColor = trend === 'up' ? 'text-success' : 'text-error'
    const trendIcon = trend === 'up' ? '↗' : '↘'

    return (
        <div className="card bg-base-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="card-body p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-base-content/70 text-sm font-medium">
                            {title}
                        </p>
                        <p className="text-base-content mt-1 text-2xl font-bold">
                            {value}
                        </p>
                        <div className={`mt-2 flex items-center ${trendColor}`}>
                            <span className="mr-1 text-sm">{trendIcon}</span>
                            <span className="text-sm font-medium">
                                {change}
                            </span>
                        </div>
                    </div>
                    <div className="text-3xl opacity-80">{icon}</div>
                </div>
            </div>
        </div>
    )
}
