import React from 'react';
import { LayoutBlock, Block } from '../types';
import { Layout, ArrowLeftRight, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import BlockComponent from './BlockComponent';

interface LayoutBlockComponentProps {
  block: LayoutBlock;
  isActive: boolean;
  onFocus: () => void;
  onDelete: () => void;
  onChange: (block: LayoutBlock) => void;
}

export default function LayoutBlockComponent({
  block,
  isActive,
  onFocus,
  onDelete,
  onChange,
}: LayoutBlockComponentProps) {
  const toggleDirection = () => {
    onChange({
      ...block,
      direction: block.direction === 'horizontal' ? 'vertical' : 'horizontal',
    });
  };

  const toggleOverflow = () => {
    onChange({
      ...block,
      allowOverflow: !block.allowOverflow,
    });
  };

  const updateChildBlock = (index: number, content: string) => {
    const newChildren = [...block.children];
    if ('content' in newChildren[index]) {
      newChildren[index] = { ...newChildren[index], content } as Block;
      onChange({ ...block, children: newChildren });
    }
  };

  const updateChildLayout = (index: number, layoutBlock: LayoutBlock) => {
    const newChildren = [...block.children];
    newChildren[index] = layoutBlock;
    onChange({ ...block, children: newChildren });
  };

  return (
    <div 
      className={`relative group border-2 ${
        isActive ? 'border-blue-200' : 'border-transparent'
      } rounded-lg p-4`}
      onClick={onFocus}
    >
      <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Layout size={16} className="text-gray-500" />
        <button
          onClick={toggleDirection}
          className="p-1 hover:bg-gray-100 rounded"
          title={`Switch to ${block.direction === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
        >
          {block.direction === 'horizontal' ? (
            <ArrowLeftRight size={16} />
          ) : (
            <ArrowUpDown size={16} />
          )}
        </button>
        <button
          onClick={toggleOverflow}
          className={`p-1 hover:bg-gray-100 rounded ${
            block.allowOverflow ? 'text-blue-500' : 'text-gray-500'
          }`}
          title={`${block.allowOverflow ? 'Disable' : 'Enable'} overflow`}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div 
        className={`flex gap-4 ${
          block.direction === 'vertical' ? 'flex-col' : 'flex-row'
        } ${block.allowOverflow ? 'overflow-x-auto' : ''}`}
      >
        {block.children.map((child, index) => (
          <div 
            key={child.id}
            className={block.direction === 'horizontal' ? 'flex-1 min-w-[200px]' : ''}
          >
            <BlockComponent
              block={child}
              isActive={false}
              onChange={(content) => updateChildBlock(index, content)}
              onFocus={() => {}}
              onDelete={() => {}}
              onUpdateLayout={
                child.type === 'layout' 
                  ? (layoutBlock) => updateChildLayout(index, layoutBlock)
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}