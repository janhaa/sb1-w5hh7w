import { useState, useCallback } from 'react';
import { Block, BlockType, LayoutBlock } from '../types';

interface HistoryState {
  past: Block[][];
  present: Block[];
  future: Block[][];
}

export function useBlockHistory(initialBlocks: Block[]) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialBlocks,
    future: [],
  });
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  const saveToHistory = useCallback((newBlocks: Block[]) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: newBlocks,
      future: [],
    }));
  }, []);

  const loadState = useCallback((newBlocks: Block[]) => {
    setHistory({
      past: [],
      present: newBlocks,
      future: [],
    });
    setActiveBlock(null);
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const addBlock = useCallback((type: BlockType, afterId: string) => {
    let newBlock: Block;
    
    if (type === 'layout') {
      newBlock = {
        id: crypto.randomUUID(),
        type: 'layout',
        direction: 'horizontal',
        allowOverflow: false,
        children: [
          {
            id: crypto.randomUUID(),
            type: 'paragraph',
            content: '',
          },
          {
            id: crypto.randomUUID(),
            type: 'paragraph',
            content: '',
          },
        ],
      };
    } else {
      newBlock = {
        id: crypto.randomUUID(),
        type,
        content: '',
      };
    }
    
    const index = history.present.findIndex(block => block.id === afterId);
    const newBlocks = [...history.present];
    newBlocks.splice(index + 1, 0, newBlock);
    
    saveToHistory(newBlocks);
    setActiveBlock(newBlock.id);
  }, [history.present, saveToHistory]);

  const updateBlock = useCallback((id: string, content: string | LayoutBlock) => {
    const newBlocks = history.present.map(block => 
      block.id === id 
        ? (typeof content === 'string' 
            ? { ...block, content } 
            : content)
        : block
    );
    saveToHistory(newBlocks);
  }, [history.present, saveToHistory]);

  const deleteBlock = useCallback((id: string) => {
    if (history.present.length > 1) {
      const newBlocks = history.present.filter(block => block.id !== id);
      saveToHistory(newBlocks);
    }
  }, [history.present, saveToHistory]);

  return {
    blocks: history.present,
    activeBlock,
    setActiveBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    loadState,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}