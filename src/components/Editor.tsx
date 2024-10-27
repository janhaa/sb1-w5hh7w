import React, { useEffect, useState } from 'react';
import { PlusCircle, Type, Heading1, Heading2, List, Undo, Redo, Code, Layout } from 'lucide-react';
import { Block, BlockType } from '../types';
import BlockComponent from './BlockComponent';
import JsonOutput from './JsonOutput';
import { useBlockHistory } from '../hooks/useBlockHistory';

interface EditorProps {
  initialBlocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export default function Editor({ initialBlocks, onChange }: EditorProps) {
  const [showJson, setShowJson] = useState(false);
  const {
    blocks,
    activeBlock,
    setActiveBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    undo,
    redo,
    canUndo,
    canRedo,
    loadState,
  } = useBlockHistory(initialBlocks);

  useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [undo, redo]);

  const handleAddBlock = (type: BlockType, afterId: string) => {
    addBlock(type, afterId);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex gap-2 mb-4">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded ${
            canUndo 
              ? 'hover:bg-gray-100 text-gray-700' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Undo (Ctrl/⌘ + Z)"
        >
          <Undo size={20} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded ${
            canRedo 
              ? 'hover:bg-gray-100 text-gray-700' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Redo (Ctrl/⌘ + Shift + Z)"
        >
          <Redo size={20} />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowJson(prev => !prev)}
          className="p-2 rounded hover:bg-gray-100 text-gray-700"
          title="Toggle JSON View"
        >
          <Code size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.id} className="group relative">
            <BlockComponent
              block={block}
              isActive={activeBlock === block.id}
              onChange={(content) => updateBlock(block.id, content)}
              onFocus={() => setActiveBlock(block.id)}
              onDelete={() => deleteBlock(block.id)}
              onUpdateLayout={(layoutBlock) => updateBlock(block.id, layoutBlock)}
            />
            
            {activeBlock === block.id && (
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const menu = document.createElement('div');
                      menu.className = 'fixed bg-white shadow-lg rounded-lg p-2 z-50';
                      menu.style.left = `${rect.left - 120}px`;
                      menu.style.top = `${rect.top}px`;
                      
                      const addBlockType = (type: BlockType) => {
                        handleAddBlock(type, block.id);
                        document.body.removeChild(menu);
                      };

                      menu.innerHTML = `
                        <div class="flex flex-col gap-2">
                          <button class="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded" data-type="paragraph">
                            <span class="w-4 h-4"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></span>
                            Text
                          </button>
                          <button class="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded" data-type="heading1">
                            <span class="w-4 h-4"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"></path></svg></span>
                            Heading 1
                          </button>
                          <button class="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded" data-type="heading2">
                            <span class="w-4 h-4"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M21 18h-4l4-7h-4"></path></svg></span>
                            Heading 2
                          </button>
                          <button class="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded" data-type="bulletList">
                            <span class="w-4 h-4"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></span>
                            Bullet List
                          </button>
                          <button class="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 rounded" data-type="layout">
                            <span class="w-4 h-4"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg></span>
                            Layout
                          </button>
                        </div>
                      `;

                      menu.addEventListener('click', (e) => {
                        const button = (e.target as Element).closest('button');
                        if (button) {
                          const type = button.getAttribute('data-type') as BlockType;
                          addBlockType(type);
                        }
                      });

                      document.body.appendChild(menu);

                      const handleClickOutside = (e: MouseEvent) => {
                        if (!menu.contains(e.target as Node)) {
                          document.body.removeChild(menu);
                          document.removeEventListener('click', handleClickOutside);
                        }
                      };

                      setTimeout(() => {
                        document.addEventListener('click', handleClickOutside);
                      });
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <PlusCircle size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showJson && <JsonOutput blocks={blocks} onLoadState={loadState} />}
    </div>
  );
}