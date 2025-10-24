'use client'

import { DeleteModalProps } from '../types'

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
}: DeleteModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="bg-opacity-50 absolute inset-0 bg-black"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="bg-base-100 relative mx-4 w-full max-w-md rounded-lg shadow-lg">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title text-lg">Delete Post</h3>
                        <p className="text-base-content/70">
                            Are you sure you want to delete{' '}
                            <strong>&quot;{itemName}&quot;</strong>? This action
                            cannot be undone.
                        </p>

                        <div className="card-actions mt-4 justify-end">
                            <button onClick={onClose} className="btn btn-ghost">
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="btn btn-error"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
