'use client'

import Layout from '@/components/dashboards/layout/layout'
import PostForm from '@/components/dashboards/forms/post-form'
import { useRouter } from 'next/navigation'

export default function CreatePostPage() {
    const router = useRouter()

    return (
        <Layout>
            <PostForm onCancel={() => router.push('/dashboard')} />
        </Layout>
    )
}
