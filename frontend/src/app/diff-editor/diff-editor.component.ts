import {Component, effect, ElementRef, signal, viewChild} from '@angular/core';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-diff-editor',
  templateUrl: './diff-editor.component.html',
  styleUrl: './diff-editor.component.css'
})
export class DiffEditorComponent {
  private diffEditorContainer = viewChild.required<ElementRef>('diffEditorContainer');
  private diffEditor: monaco.editor.IStandaloneDiffEditor | null = null;

  originalCode = signal('const x = 1;');
  modifiedCode = signal('const x = 2;');

  constructor() {
    effect(() => {
      const container = this.diffEditorContainer();
      if (container && !this.diffEditor) {
        this.initDiffEditor();
      }
    });
  }

  private initDiffEditor() {
    const container = this.diffEditorContainer().nativeElement;

    const originalModel = monaco.editor.createModel(
      this.originalCode(),
      'javascript'
    );

    const modifiedModel = monaco.editor.createModel(
      this.modifiedCode(),
      'javascript'
    );

    this.diffEditor = monaco.editor.createDiffEditor(container, {
      automaticLayout: true,
      readOnly: false
    });

    this.diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    });
  }
}
