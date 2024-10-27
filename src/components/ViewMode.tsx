import React from 'react';
import { Block } from '../types';

interface ViewModeProps {
  blocks: Block[];
}

export default function ViewMode({ blocks }: ViewModeProps) {
  const renderBlock = (block: Block) => {
    if (block.type === 'layout') {
      return (
        <div 
          className={`flex gap-4 ${
            block.direction === 'vertical' ? 'flex-col' : 'flex-row'
          } ${block.allowOverflow ? 'overflow-x-auto' : ''}`}
        >
          {block.children.map((child) => (
            <div 
              key={child.id}
              className={block.direction === 'horizontal' ? 'flex-1 min-w-[200px]' : ''}
            >
              {renderBlock(child)}
            </div>
          ))}
        </div>
      );
    }

    const getBlockStyle = (type: Block['type']) => {
      switch (type) {
        case 'heading1':
          return 'text-4xl font-bold mb-4';
        case 'heading2':
          return 'text-2xl font-semibold mb-3';
        case 'bulletList':
          return 'list-disc ml-6 mb-2';
        default:
          return 'text-base mb-2';
      }
    };

    return (
      <div
        className={getBlockStyle(block.type)}
        dangerouslySetInnerHTML={{ __html: 'content' in block ? block.content : '' }}
      />
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-8 prose">
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
}