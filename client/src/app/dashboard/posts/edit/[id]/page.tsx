'use client'

import Layout from '@/components/dashboards/layout/layout'
import PostForm from '@/components/dashboards/forms/post-form'
import { useRouter, useParams } from 'next/navigation'
import { usePostByIdQuery } from '@/hooks/posts/getDetailQuery'

export default function EditPostPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string | undefined

    const { data: post, isLoading, isError } = usePostByIdQuery(id!)

    if (!id) {
        router.push('/dashboard')
        return null
    }

    if (isLoading) {
        return (
            <Layout>
                <div className="flex min-h-96 items-center justify-center">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </Layout>
        )
    }

    if (isError || !post) {
        return (
            <Layout>
                <div className="flex min-h-96 items-center justify-center text-center">
                    <div>
                        <div className="mb-4 text-6xl">❌</div>
                        <h2 className="mb-2 text-2xl font-bold">
                            Post Not Found
                        </h2>
                        <p className="text-base-content/70 mb-4">
                            The post you are trying to edit does not exist.
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => router.push('/dashboard')}
                        >
                            Back to posts
                        </button>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <PostForm post={post} onCancel={() => router.push('/dashboard')} />
        </Layout>
    )
}
