export type BlockType = 'paragraph' | 'heading1' | 'heading2' | 'bulletList' | 'layout';

export type LayoutDirection = 'horizontal' | 'vertical';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ContentBlock extends BaseBlock {
  type: Exclude<BlockType, 'layout'>;
  content: string;
}

export interface LayoutBlock extends BaseBlock {
  type: 'layout';
  direction: LayoutDirection;
  allowOverflow: boolean;
  children: Block[];
}

export type Block = ContentBlock | LayoutBlock;