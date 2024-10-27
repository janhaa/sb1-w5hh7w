import React, { useState } from 'react';
import { Block } from '../types';

interface JsonOutputProps {
  blocks: Block[];
  onLoadState?: (blocks: Block[]) => void;
}

export default function JsonOutput({ blocks, onLoadState }: JsonOutputProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleLoadState = () => {
    try {
      const parsedBlocks = JSON.parse(jsonInput);
      
      // Validate the structure
      if (!Array.isArray(parsedBlocks)) {
        throw new Error('Input must be an array of blocks');
      }
      
      const isValidBlock = (block: any): block is Block => {
        return typeof block.id === 'string' &&
               typeof block.content === 'string' &&
               ['paragraph', 'heading1', 'heading2', 'bulletList'].includes(block.type);
      };

      if (!parsedBlocks.every(isValidBlock)) {
        throw new Error('Invalid block structure');
      }

      onLoadState?.(parsedBlocks);
      setError('');
      setJsonInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  return (
    <div className="mt-8 border-t pt-4 space-y-4">
      <h2 className="text-lg font-semibold">Editor State</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Current State:
        </label>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(blocks, null, 2)}
        </pre>
      </div>

      {onLoadState && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Load State:
          </label>
          <div className="flex gap-2">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON state here..."
              className="flex-1 min-h-[100px] p-2 border rounded-lg font-mono text-sm resize-y"
            />
            <button
              onClick={handleLoadState}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors h-fit"
            >
              Load
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}