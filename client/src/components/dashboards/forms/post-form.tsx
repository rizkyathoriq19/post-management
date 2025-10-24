'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useCreatePostMutation } from '@/hooks/posts/createMutation'
import { useUpdatePostMutation } from '@/hooks/posts/updateMutation'
import { getImageUrl } from '@/utils/helper'

interface PostFormProps {
    post?: {
        id: number
        title: string
        content: string
        image: string | null
        created_at: string
        updated_at: string
        user_id: number
        username: string
        email: string
        role: string
    }
    onCancel: () => void
}

export default function PostForm({ post, onCancel }: PostFormProps) {
    const { mutateAsync: createPost, isPending: isCreating } =
        useCreatePostMutation()
    const { mutateAsync: updatePost, isPending: isUpdating } =
        useUpdatePostMutation()

    const [formData, setFormData] = useState({
        title: post?.title || '',
        content: post?.content || '',
        image: null as File | null,
    })

    const [imagePreview, setImagePreview] = useState<string | null>(
        post?.image || null
    )
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFormData(prev => ({ ...prev, image: file }))

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        } else {
            setImagePreview(post?.image || null)
        }
    }

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }))
        setImagePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (post && post.id) {
                await updatePost({ id: String(post.id), ...formData })
            } else {
                await createPost(formData)
            }
            onCancel()
        } catch (error) {
            console.error('❌ Failed to save post:', error)
            alert('Error saving post.')
        }
    }

    return (
        <div className="bg-base-200 flex items-center justify-center px-4 py-8">
            <div className="card bg-base-100 w-full max-w-2xl shadow-xl">
                <div className="card-body">
                    <h2 className="mb-6 text-center text-2xl font-bold">
                        {post ? 'Edit Post' : 'Create New Post'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Title
                                </span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter post title"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Content
                                </span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your post content..."
                                className="textarea textarea-bordered h-40 w-full"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Featured Image
                                </span>
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input file-input-bordered w-full"
                            />

                            {imagePreview && (
                                <div className="mt-4 flex flex-col items-center">
                                    <div className="relative">
                                        <Image
                                            src={getImageUrl(imagePreview)}
                                            alt="Preview"
                                            width={220}
                                            height={220}
                                            className="rounded-lg object-cover shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="btn btn-circle btn-xs btn-error absolute -top-3 -right-3"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="divider my-6" />
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn btn-ghost"
                                disabled={isCreating || isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isCreating || isUpdating}
                            >
                                {isCreating || isUpdating ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        {post ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : post ? (
                                    'Update Post'
                                ) : (
                                    'Create Post'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
