// models/file-tree.model.ts
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  expanded?: boolean;
  content?: string;
  selected?: boolean;  // ← Add this property
}
