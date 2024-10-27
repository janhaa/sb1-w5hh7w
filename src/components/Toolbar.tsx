import React from 'react';
import { Bold, Underline, Link } from 'lucide-react';

interface ToolbarProps {
  onBold: () => void;
  onUnderline: () => void;
  onLink: () => void;
}

export default function Toolbar({ onBold, onUnderline, onLink }: ToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white border rounded-lg shadow-sm">
      <button
        onClick={onBold}
        className="p-1.5 hover:bg-gray-100 rounded"
        title="Bold (Ctrl/⌘ + B)"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={onUnderline}
        className="p-1.5 hover:bg-gray-100 rounded"
        title="Underline (Ctrl/⌘ + U)"
      >
        <Underline size={16} />
      </button>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <button
        onClick={onLink}
        className="p-1.5 hover:bg-gray-100 rounded"
        title="Add Link (Ctrl/⌘ + K)"
      >
        <Link size={16} />
      </button>
    </div>
  );
}