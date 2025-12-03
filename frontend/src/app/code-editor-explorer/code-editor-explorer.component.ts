// components/code-editor-with-explorer.component.ts
import {Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as monaco from 'monaco-editor'
import {MonacoEditorComponent, MonacoEditorOptions} from '../monaco-editor/monaco-editor.component';
import {FileExplorerComponent} from '../file-explorer/file-explorer.component';
import {FileNode} from '../shared/file-node';

@Component({
  selector: 'app-code-editor-explorer',
  standalone: true,
  imports: [
    CommonModule,
    MonacoEditorComponent,
    FileExplorerComponent
  ],
  templateUrl: './code-editor-explorer.component.html',
  styleUrls: ['./code-editor-explorer.component.css']
})
export class CodeEditorWithExplorerComponent {
  sidebarCollapsed = signal(false);
  currentFile = signal<FileNode | null>(null);
  editorContent = signal('');
  originalContent = signal('');
  cursorPosition = signal({line: 1, column: 1});

  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  // Sample file tree
  fileTree = signal<FileNode[]>([
    {
      name: 'src',
      path: 'src',
      type: 'folder',
      expanded: true,
      children: [
        {
          name: 'main',
          path: 'src/main',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: 'java',
              path: 'src/main/java',
              type: 'folder',
              expanded: true,
              children: [
                {
                  name: 'com',
                  path: 'src/main/java/com',
                  type: 'folder',
                  expanded: true,
                  children: [
                    {
                      name: 'example',
                      path: 'src/main/java/com/example',
                      type: 'folder',
                      expanded: true,
                      children: [
                        {
                          name: 'Main.java',
                          path: 'src/main/java/com/example/Main.java',
                          type: 'file',
                          content: `package com.example;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
                        },
                        {
                          name: 'User.java',
                          path: 'src/main/java/com/example/User.java',
                          type: 'file',
                          content: `package com.example;

public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}`
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: 'resources',
              path: 'src/main/resources',
              type: 'folder',
              expanded: false,
              children: [
                {
                  name: 'application.properties',
                  path: 'src/main/resources/application.properties',
                  type: 'file',
                  content: 'server.port=8080\nspring.application.name=myapp'
                }
              ]
            }
          ]
        },
        {
          name: 'test',
          path: 'src/test',
          type: 'folder',
          expanded: false,
          children: []
        }
      ]
    },
    {
      name: 'pom.xml',
      path: 'pom.xml',
      type: 'file',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>myapp</artifactId>
    <version>1.0.0</version>
</project>`
    },
    {
      name: 'README.md',
      path: 'README.md',
      type: 'file',
      content: '# My Project\n\nThis is a sample project.'
    }
  ]);

  editorOptions: MonacoEditorOptions = {
    automaticLayout: true,
    fontSize: 14,
    minimap: {enabled: true},
    lineNumbers: 'on',
    tabSize: 4,
    insertSpaces: true
  };

  hasChanges = computed(() =>
    this.editorContent() !== this.originalContent()
  );

  toggleSidebar() {
    this.sidebarCollapsed.update(val => !val);
  }

  onFileSelect(file: FileNode) {
    // Clear previous selection
    this.clearSelection(this.fileTree());

    // Mark new file as selected
    this.setFileSelected(this.fileTree(), file.path);

    this.currentFile.set(file);
    this.editorContent.set(file.content || '');
    this.originalContent.set(file.content || '');

    // Trigger file tree update to reflect selection change
    this.fileTree.set([...this.fileTree()]);
  }

  onNodeToggle(node: FileNode) {
    this.toggleNodeInTree(this.fileTree(), node.path);
    this.fileTree.set([...this.fileTree()]);
  }

  private clearSelection(nodes: FileNode[]) {
    nodes.forEach(node => {
      if (node.selected) {
        node.selected = false;
      }
      if (node.children) {
        this.clearSelection(node.children);
      }
    });
  }

  private setFileSelected(nodes: FileNode[], path: string): boolean {
    for (const node of nodes) {
      if (node.path === path && node.type === 'file') {
        node.selected = true;
        return true;
      }
      if (node.children && this.setFileSelected(node.children, path)) {
        return true;
      }
    }
    return false;
  }

  private toggleNodeInTree(nodes: FileNode[], path: string): boolean {
    for (const node of nodes) {
      if (node.path === path) {
        node.expanded = !node.expanded;
        return true;
      }
      if (node.children && this.toggleNodeInTree(node.children, path)) {
        return true;
      }
    }
    return false;
  }

  onCodeChange(newCode: string) {
    this.editorContent.set(newCode);
  }

  onEditorReady(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      this.cursorPosition.set({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });

    // Save shortcut
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => this.saveFile()
    );
  }

  saveFile() {
    const file = this.currentFile();
    if (!file) return;

    // Update file content in tree
    this.updateFileContent(this.fileTree(), file.path, this.editorContent());
    this.originalContent.set(this.editorContent());

    console.log('File saved:', file.path);
    // Here you would typically send to backend
  }

  private updateFileContent(nodes: FileNode[], path: string, content: string): boolean {
    for (const node of nodes) {
      if (node.path === path && node.type === 'file') {
        node.content = content;
        return true;
      }
      if (node.children && this.updateFileContent(node.children, path, content)) {
        return true;
      }
    }
    return false;
  }

  formatCode() {
    this.editor?.getAction('editor.action.formatDocument')?.run();
  }

  getLanguage(): string {
    const file = this.currentFile();
    if (!file) return 'plaintext';

    const ext = file.name.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'java': 'java',
      'js': 'javascript',
      'ts': 'typescript',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'xml': 'xml',
      'md': 'markdown',
      'properties': 'properties'
    };

    return langMap[ext || ''] || 'plaintext';
  }

  onNewFile() {
    console.log('Create new file');
    // Implement new file creation
  }

  onNewFolder() {
    console.log('Create new folder');
    // Implement new folder creation
  }
}
