// parent.component.ts
import {Component, signal} from '@angular/core';
import {MonacoEditorComponent} from '../monaco-editor/monaco-editor.component';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [
    MonacoEditorComponent
  ],
  templateUrl: './code-editor.component.html',
  styleUrl: 'code-editor.component.css'
  // template: `
  //   <div class="editor-page">
  //     <div class="toolbar">
  //       <button (click)="changeLanguage('typescript')">TypeScript</button>
  //       <button (click)="changeLanguage('javascript')">JavaScript</button>
  //       <button (click)="changeLanguage('json')">JSON</button>
  //       <button (click)="changeLanguage('html')">HTML</button>
  //       <button (click)="toggleTheme()">Toggle Theme</button>
  //       <button (click)="formatCode()">Format</button>
  //     </div>
  //
  //     <app-monaco-editor
  //       [code]="code()"
  //       [language]="language()"
  //       [theme]="theme()"
  //       [readOnly]="false"
  //       (codeChange)="onCodeChange($event)"
  //       (editorReady)="onEditorReady($event)"
  //       class="editor-wrapper"
  //     />
  //
  //     <div class="output">
  //       <h3>Current Code:</h3>
  //       <pre>{{ code() }}</pre>
  //     </div>
  //   </div>
  // `,
  // styles: [`
  //   .editor-page {
  //     display: flex;
  //     flex-direction: column;
  //     height: 100vh;
  //     padding: 1rem;
  //   }
  //
  //   .toolbar {
  //     display: flex;
  //     gap: 0.5rem;
  //     margin-bottom: 1rem;
  //     padding: 0.5rem;
  //     background: var(--p-surface-50);
  //     border-radius: 6px;
  //   }
  //
  //   .toolbar button {
  //     padding: 0.5rem 1rem;
  //     border: 1px solid var(--p-surface-300);
  //     border-radius: 4px;
  //     background: white;
  //     cursor: pointer;
  //   }
  //
  //   .toolbar button:hover {
  //     background: var(--p-surface-100);
  //   }
  //
  //   .editor-wrapper {
  //     flex: 1;
  //     border: 1px solid var(--p-surface-300);
  //     border-radius: 8px;
  //     overflow: hidden;
  //   }
  //
  //   .output {
  //     margin-top: 1rem;
  //     padding: 1rem;
  //     background: var(--p-surface-50);
  //     border-radius: 6px;
  //     max-height: 200px;
  //     overflow: auto;
  //   }
  //
  //   pre {
  //     margin: 0;
  //     font-size: 0.875rem;
  //   }
  // `]
})
export class CodeEditorComponent {
  code = signal(`function hello() {
  console.log("Hello, Monaco!");
}`);

  language = signal('javascript');
  theme = signal<'vs' | 'vs-dark' | 'hc-black'>('vs-dark');

  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  onCodeChange(newCode: string) {
    this.code.set(newCode);
  }

  onEditorReady(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;
    console.log('Editor is ready!');
  }

  changeLanguage(lang: string) {
    this.language.set(lang);

    // Set sample code for each language
    const samples: Record<string, string> = {
      typescript: 'const greeting: string = "Hello, TypeScript!";',
      javascript: 'const greeting = "Hello, JavaScript!";',
      json: '{\n  "name": "Monaco Editor",\n  "version": "1.0.0"\n}',
      html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page</title>\n  </head>\n  <body>\n    <h1>Hello</h1>\n  </body>\n</html>'
    };

    this.code.set(samples[lang] || '');
  }

  toggleTheme() {
    this.theme.update(current => current === 'vs-dark' ? 'vs' : 'vs-dark');
  }

  formatCode() {
    if (this.editor) {
      this.editor.getAction('editor.action.formatDocument')?.run();
    }
  }
}
