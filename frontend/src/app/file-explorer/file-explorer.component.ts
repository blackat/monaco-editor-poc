// components/file-explorer.component.ts
import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileNode} from '../shared/file-node';
import {FileTreeNodeComponent} from '../file-tree-node/file-tree-node.component';

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [CommonModule, FileTreeNodeComponent],
  templateUrl: `./file-explorer.component.html`,
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent {
  files = input.required<FileNode[]>();
  fileSelect = output<FileNode>();
  nodeToggle = output<FileNode>();
  newFile = output<void>();
  newFolder = output<void>();
}
