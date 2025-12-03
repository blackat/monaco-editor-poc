// components/file-tree-node.component.ts
import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileNode} from '../shared/file-node';

@Component({
  selector: 'app-file-tree-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-tree-node.component.html',
  styleUrl: './file-tree-node.component.css'
})
export class FileTreeNodeComponent {
  node = input.required<FileNode>();
  level = input.required<number>();
  fileSelect = output<FileNode>();
  nodeToggle = output<FileNode>();

  onNodeClick() {
    if (this.node().type === 'file') {
      this.fileSelect.emit(this.node());
    } else {
      this.onToggle(new Event('click'));
    }
  }

  onToggle(event: Event) {
    event.stopPropagation();
    this.nodeToggle.emit(this.node());
  }

  getFileIcon(): string {
    const node = this.node();
    if (node.type === 'folder') return '';

    const ext = node.name.split('.').pop()?.toLowerCase();

    const iconMap: Record<string, string> = {
      'java': 'pi-file-java',
      'js': 'pi-file-javascript',
      'ts': 'pi-file-typescript',
      'html': 'pi-file-html',
      'css': 'pi-file-css',
      'json': 'pi-file-json',
      'xml': 'pi-file-xml',
      'txt': 'pi-file',
      'md': 'pi-file-md',
      'properties': 'pi-file'
    };

    return iconMap[ext || ''] || 'pi-file';
  }
}
