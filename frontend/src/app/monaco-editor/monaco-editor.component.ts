// monaco-editor.component.ts
import {Component, effect, ElementRef, input, OnDestroy, output, signal, viewChild} from '@angular/core';
import * as monaco from 'monaco-editor';

export interface MonacoEditorOptions extends monaco.editor.IStandaloneEditorConstructionOptions {
}

@Component({
  selector: 'app-monaco-editor',
  standalone: true,
  templateUrl: './monaco-editor.component.html',
  styleUrl: './monaco-editor.component.css'
})
export class MonacoEditorComponent implements OnDestroy {
  private editorContainer = viewChild.required<ElementRef>('editorContainer');

  // Inputs
  code = input<string>('');
  language = input<string>('javascript');
  theme = input<'vs' | 'vs-dark' | 'hc-black' | 'hc-light'>('vs-dark');
  readOnly = input<boolean>(false);
  options = input<MonacoEditorOptions>({});

  // Outputs
  codeChange = output<string>();
  editorReady = output<monaco.editor.IStandaloneCodeEditor>();

  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private isInitialized = signal(false);

  constructor() {
    // Initialize Monaco environment once
    this.initMonacoEnvironment();

    // Initialize editor
    effect(() => {
      const container = this.editorContainer();
      if (container && !this.editor) {
        this.initEditor();
      }
    });

    // Update code
    effect(() => {
      const newCode = this.code();
      if (this.isInitialized() && this.editor) {
        const currentCode = this.editor.getValue();
        if (currentCode !== newCode) {
          this.editor.setValue(newCode);
        }
      }
    });

    // Update language
    effect(() => {
      const newLanguage = this.language();
      if (this.isInitialized() && this.editor) {
        const model = this.editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, newLanguage);
        }
      }
    });

    // Update theme
    effect(() => {
      const newTheme = this.theme();
      if (this.isInitialized()) {
        monaco.editor.setTheme(newTheme);
      }
    });

    // Update readonly
    effect(() => {
      const readOnly = this.readOnly();
      if (this.isInitialized() && this.editor) {
        this.editor.updateOptions({readOnly});
      }
    });

    // Update options
    effect(() => {
      const newOptions = this.options();
      if (this.isInitialized() && this.editor) {
        this.editor.updateOptions(newOptions);
      }
    });
  }

  private initMonacoEnvironment(): void {
    if ((window as any).MonacoEnvironment) {
      return; // Already initialized
    }

    (window as any).MonacoEnvironment = {
      getWorkerUrl: (_: string, label: string) => {
        const base = 'assets/monaco-editor/esm/vs';

        switch (label) {
          case 'json':
            return `${base}/language/json/json.worker.js`;
          case 'css':
          case 'scss':
          case 'less':
            return `${base}/language/css/css.worker.js`;
          case 'html':
          case 'handlebars':
          case 'razor':
            return `${base}/language/html/html.worker.js`;
          case 'typescript':
          case 'javascript':
            return `${base}/language/typescript/ts.worker.js`;
          default:
            return `${base}/editor/editor.worker.js`;
        }
      }
    };
  }

  private initEditor(): void {
    const container = this.editorContainer().nativeElement;

    const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
      value: this.code(),
      language: this.language(),
      theme: this.theme(),
      readOnly: this.readOnly(),
      automaticLayout: true,
      minimap: {enabled: true},
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      wordWrap: 'off'
    };

    this.editor = monaco.editor.create(container, {
      ...defaultOptions,
      ...this.options()
    });

    // Listen for content changes
    this.editor.onDidChangeModelContent(() => {
      if (this.editor) {
        const value = this.editor.getValue();
        this.codeChange.emit(value);
      }
    });

    this.isInitialized.set(true);
    this.editorReady.emit(this.editor);
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
  }

  // Public API methods
  getValue(): string {
    return this.editor?.getValue() || '';
  }

  setValue(value: string): void {
    this.editor?.setValue(value);
  }

  getEditor(): monaco.editor.IStandaloneCodeEditor | null {
    return this.editor;
  }

  format(): Promise<void> {
    return this.editor?.getAction('editor.action.formatDocument')?.run() || Promise.resolve();
  }

  focus(): void {
    this.editor?.focus();
  }

  layout(): void {
    this.editor?.layout();
  }
}
