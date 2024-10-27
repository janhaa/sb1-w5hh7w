import React, { useRef, useEffect } from 'react';
import { Block, LayoutBlock } from '../types';
import Toolbar from './Toolbar';
import LayoutBlockComponent from './LayoutBlockComponent';

interface BlockComponentProps {
  block: Block;
  isActive: boolean;
  onChange: (content: string) => void;
  onFocus: () => void;
  onDelete: () => void;
  onUpdateLayout?: (layoutBlock: LayoutBlock) => void;
}

export default function BlockComponent({
  block,
  isActive,
  onChange,
  onFocus,
  onDelete,
  onUpdateLayout,
}: BlockComponentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isActive]);

  if (block.type === 'layout') {
    return (
      <LayoutBlockComponent
        block={block}
        isActive={isActive}
        onFocus={onFocus}
        onDelete={onDelete}
        onChange={onUpdateLayout!}
      />
    );
  }

  const getBlockStyle = () => {
    switch (block.type) {
      case 'heading1':
        return 'text-4xl font-bold';
      case 'heading2':
        return 'text-2xl font-semibold';
      case 'bulletList':
        return 'list-disc ml-6';
      default:
        return 'text-base';
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleBold = () => execCommand('bold');
  const handleUnderline = () => execCommand('underline');
  const handleLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !block.content) {
      e.preventDefault();
      onDelete();
    }

    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleBold();
          break;
        case 'u':
          e.preventDefault();
          handleUnderline();
          break;
        case 'k':
          e.preventDefault();
          handleLink();
          break;
      }
    }
  };

  return (
    <div className="relative group">
      {isActive && block.type === 'paragraph' && (
        <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Toolbar
            onBold={handleBold}
            onUnderline={handleUnderline}
            onLink={handleLink}
          />
        </div>
      )}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className={`outline-none p-2 rounded-lg hover:bg-gray-50 ${getBlockStyle()} ${
          isActive ? 'bg-gray-50' : ''
        }`}
        onFocus={onFocus}
        onBlur={() => {
          if (contentRef.current) {
            onChange(contentRef.current.innerHTML);
          }
        }}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: block.content || '<br>' }}
      />
    </div>
  );
}