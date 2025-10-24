'use client'

import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/dashboards/layout/layout'
import { usePostByIdQuery } from '@/hooks/posts/getDetailQuery'
import Image from 'next/image'
import { getImageUrl } from '@/utils/helper'

export default function PostDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const { data: post, isLoading, isError } = usePostByIdQuery(id)

    if (isLoading) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </Layout>
        )
    }

    if (isError || !post) {
        return (
            <Layout>
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                    <div className="mb-4 text-6xl">❌</div>
                    <h2 className="mb-2 text-2xl font-bold">Post Not Found</h2>
                    <p className="text-base-content/70 mb-4">
                        This post does not exist or has been deleted.
                    </p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="btn btn-primary"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="px-4 py-6 lg:px-8">
                <div className="card bg-base-100 mx-auto max-w-3xl shadow-xl">
                    {post.image && (
                        <figure className="bg-base-200 relative h-64 w-full">
                            <Image
                                src={getImageUrl(post.image)}
                                alt={post.title}
                                fill
                                className="rounded-t-xl object-cover"
                            />
                        </figure>
                    )}
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">
                            {post.title}
                        </h2>
                        <p className="text-base-content/60 text-sm">
                            By{' '}
                            <span className="font-semibold">
                                {post.username}
                            </span>{' '}
                            •{' '}
                            {new Date(post.created_at).toLocaleDateString(
                                'en-US',
                                {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }
                            )}
                        </p>

                        <div className="divider my-2"></div>

                        <p className="leading-relaxed whitespace-pre-line">
                            {post.content}
                        </p>

                        <div className="divider my-4"></div>

                        <div className="flex justify-end space-x-3">
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => router.push('/dashboard')}
                            >
                                Back
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                    router.push(
                                        `/dashboard/posts/edit/${post.id}`
                                    )
                                }
                            >
                                Edit Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
