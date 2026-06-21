import React, { memo } from 'react'

interface ActionButtonsRowProps {
    onCreateClick: () => void
    onShareClick: () => void
    isShareDisabled: boolean
}

export const ActionButtonsRow: React.FC<ActionButtonsRowProps> = memo(({
    onCreateClick,
    onShareClick,
    isShareDisabled,
}) => {
    return (
        <div className="mb-6 lg:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            <button
                onClick={onCreateClick}
                className="bg-blue-500 text-white p-3 sm:p-4 lg:p-5 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition text-sm sm:text-base lg:text-lg font-semibold shadow-md hover:shadow-lg"
            >
                Add new todo
            </button>
            <button
                onClick={onShareClick}
                disabled={isShareDisabled}
                className="bg-green-500 text-white p-3 sm:p-4 lg:p-5 rounded-lg hover:bg-green-600 active:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base lg:text-lg font-semibold shadow-md hover:shadow-lg"
            >
                📧 Share List
            </button>
        </div>
    )
})
