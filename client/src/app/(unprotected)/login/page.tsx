'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoginMutation } from '@/hooks/auth/loginMutation'

export default function LoginPage() {
    const router = useRouter()
    const loginMutation = useLoginMutation()
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        loginMutation.mutate(formData, {
            onSuccess: () => {
                router.push('/dashboard')
            },
            onError: (err: unknown) => {
                alert((err as Error).message)
            },
        })
    }

    return (
        <div className="bg-base-200 flex min-h-screen items-center justify-center px-4">
            <div className="card bg-base-100 w-full max-w-md shadow-xl">
                <div className="card-body">
                    <div className="mb-6 flex flex-col items-center">
                        <h2 className="text-2xl font-bold">Welcome Back</h2>
                        <p className="text-base-content/70">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Username or Email
                                </span>
                            </label>
                            <input
                                type="text"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                placeholder="Enter your username or email"
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
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <a
                            onClick={() => router.push('/register')}
                            className="link link-primary cursor-pointer"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
