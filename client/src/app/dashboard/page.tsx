'use client'

import Layout from '@/components/dashboards/layout/layout'
import TableCard from '@/components/dashboards/cards/table-card'
import DataTable from '@/components/dashboards/tables/data-table'
import { useRouter } from 'next/navigation'

export default function PostsListPage() {
    const router = useRouter()

    return (
        <Layout>
            <TableCard
                title="Post Management"
                actions={
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => router.push('/dashboard/posts/create')}
                    >
                        + Add New Post
                    </button>
                }
            >
                <DataTable />
            </TableCard>
        </Layout>
    )
}
