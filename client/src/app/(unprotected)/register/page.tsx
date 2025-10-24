'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRegisterMutation } from '@/hooks/auth/registerMutation'

export default function RegisterPage() {
    const router = useRouter()
    const registerMutation = useRegisterMutation()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        registerMutation.mutate(formData, {
            onSuccess: () => {
                router.push('/login')
            },
            onError: (error: unknown) => {
                alert(
                    `❌ ${String((error as Error).message || 'Registration failed')}`
                )
            },
        })
    }

    return (
        <div className="bg-base-200 flex min-h-screen items-center justify-center px-4">
            <div className="card bg-base-100 w-full max-w-md shadow-xl">
                <div className="card-body">
                    <div className="mb-6 flex flex-col items-center">
                        <h2 className="text-2xl font-bold">
                            Create an Account
                        </h2>
                        <p className="text-base-content/70">
                            Start managing your dashboard today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Your username"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary mt-2 w-full"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        Already have an account?{' '}
                        <a
                            onClick={() => router.push('/login')}
                            className="link link-primary cursor-pointer"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
