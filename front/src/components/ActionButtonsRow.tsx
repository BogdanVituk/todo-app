import React, { memo } from 'react'
import { Plus, Share2 } from 'lucide-react'

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
    <div className="flex gap-2 mb-4">
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium shadow-sm"
      >
        <Plus size={16} />
        New todo
      </button>
      <button
        onClick={onShareClick}
        disabled={isShareDisabled}
        className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Share2 size={16} />
        Share
      </button>
    </div>
  )
})