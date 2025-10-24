'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { usePostsQuery } from '@/hooks/posts/getAllQuery'
import DeleteModal from '@/components/dashboards/modals/delete-modal'
import { useDeletePostMutation } from '@/hooks/posts/deleteMutation'

export default function DataTable() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initialPage = Number(searchParams.get('page')) || 1
    const initialLimit = Number(searchParams.get('limit')) || 10
    const initialSearch = searchParams.get('search') || ''

    const [page, setPage] = useState(initialPage)
    const [limit, setLimit] = useState(initialLimit)
    const [search, setSearch] = useState(initialSearch)
    const [mounted, setMounted] = useState(false)

    const [debouncedSearch] = useDebounce(search, 500)

    const { data, isLoading, isError, isFetching } = usePostsQuery(
        page.toString(),
        limit.toString(),
        debouncedSearch
    )
    const deleteMutation = useDeletePostMutation()

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        postId: null as number | null,
        title: null as string | null,
    })

    const posts = data?.data || []
    const meta = data?.meta

    useEffect(() => {
        if (!mounted) {
            setMounted(true)
            return
        }

        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', limit.toString())
        if (debouncedSearch) params.set('search', debouncedSearch)

        router.replace(`?${params.toString()}`)
    }, [page, limit, debouncedSearch, router, mounted])

    const handlePageChange = (newPage: number) => {
        if (meta && newPage >= 1 && newPage <= meta.total_page) setPage(newPage)
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLimit(parseInt(e.target.value))
        setPage(1)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleClearSearch = () => {
        setSearch('')
        setPage(1)

        const params = new URLSearchParams()
        params.set('page', '1')
        params.set('limit', limit.toString())
        router.replace(`?${params.toString()}`)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteModal.postId) return
        try {
            await deleteMutation.mutateAsync(deleteModal.postId.toString())
        } catch (error) {
            console.error('Failed to delete post:', error)
        } finally {
            setDeleteModal({ isOpen: false, postId: null, title: null })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-error py-8 text-center">
                Failed to fetch posts. Please try again.
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="border-base-300 flex flex-col items-center justify-between gap-4 border-b pb-3 sm:flex-row">
                    <h3 className="text-lg font-semibold">All Posts</h3>

                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={search}
                            onChange={handleSearchChange}
                            className="input input-bordered w-full pr-10 pl-10"
                        />
                        <span className="text-base-content/60 absolute top-1/2 left-3 -translate-y-1/2 transform">
                            🔍
                        </span>

                        {/* Clear button */}
                        {search && !isFetching && (
                            <button
                                onClick={handleClearSearch}
                                className="text-base-content/60 hover:text-error absolute top-1/2 right-3 -translate-y-1/2"
                            >
                                ✕
                            </button>
                        )}

                        {/* Spinner while fetching */}
                        {isFetching && (
                            <span className="absolute top-1/2 right-3 -translate-y-1/2">
                                <span className="loading loading-spinner loading-sm text-primary"></span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table-zebra table w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Author</th>
                                <th>Created At</th>
                                <th className="w-16 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id}>
                                    <td className="font-bold">{post.title}</td>
                                    <td className="max-w-md">
                                        {post.content.length > 100
                                            ? post.content.slice(0, 100) + '...'
                                            : post.content}
                                    </td>
                                    <td>{post.username}</td>
                                    <td>
                                        {new Date(
                                            post.created_at
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td className="text-center">
                                        <div className="dropdown dropdown-end">
                                            <button
                                                tabIndex={0}
                                                className="btn btn-ghost btn-xs"
                                                title="Actions"
                                            >
                                                ⋮
                                            </button>
                                            <ul
                                                tabIndex={0}
                                                className="dropdown-content menu menu-sm bg-base-100 rounded-box w-28 shadow"
                                            >
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/posts/${post.id}`
                                                            )
                                                        }
                                                    >
                                                        Detail
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/posts/edit/${post.id}`
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        className="text-error"
                                                        onClick={() =>
                                                            setDeleteModal({
                                                                isOpen: true,
                                                                postId: post.id,
                                                                title: post.title,
                                                            })
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {posts.length === 0 && (
                        <div className="text-base-content/60 py-10 text-center">
                            No posts found.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {meta && (
                    <div className="border-base-300 text-base-content/70 flex flex-col gap-4 border-t pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                        {/* Left: Info */}
                        <div>
                            Showing <strong>{(page - 1) * limit + 1}</strong>–
                            <strong>
                                {Math.min(page * limit, meta.total_items)}
                            </strong>{' '}
                            of <strong>{meta.total_items}</strong> posts
                        </div>

                        {/* Middle: Pagination */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className="btn btn-sm btn-ghost"
                            >
                                «
                            </button>
                            {Array.from({ length: meta.total_page }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`btn btn-sm ${
                                        page === i + 1
                                            ? 'btn-primary'
                                            : 'btn-ghost'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === meta.total_page}
                                className="btn btn-sm btn-ghost"
                            >
                                »
                            </button>
                        </div>

                        {/* Right: Rows per page */}
                        <div className="flex items-center gap-2">
                            <span>Rows:</span>
                            <select
                                value={limit}
                                onChange={handleLimitChange}
                                className="select select-bordered select-sm"
                            >
                                {[5, 10, 25, 50].map(n => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() =>
                    setDeleteModal({ isOpen: false, postId: null, title: null })
                }
                onConfirm={handleDeleteConfirm}
                itemName={deleteModal.title || ''}
            />
        </>
    )
}
