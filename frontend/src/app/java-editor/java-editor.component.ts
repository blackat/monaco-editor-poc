import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MonacoEditorComponent, MonacoEditorOptions} from '../monaco-editor/monaco-editor.component';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-java-code-editor',
  standalone: true,
  imports: [MonacoEditorComponent, FormsModule],
  templateUrl: './java-editor.component.html',
  styleUrls: ['./java-editor.component.css']
})
export class JavaCodeEditorComponent {
  javaCode = signal(`public class Example {
    private String name;

    public Example(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public static void main(String[] args) {
        Example example = new Example("Test");
        System.out.println("Name: " + example.getName());
    }
}`);

  currentTheme = signal<'vs' | 'vs-dark'>('vs-dark');
  fontSize = 14;

  editorOptions = signal<MonacoEditorOptions>({
    automaticLayout: true,
    fontSize: this.fontSize,
    minimap: {enabled: true},
    lineNumbers: 'on',
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'off',
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    formatOnPaste: true,
    formatOnType: true
  });

  lineCount = signal(0);
  charCount = signal(0);

  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  onEditorReady(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;

    // Add keyboard shortcut for formatting (Ctrl+Alt+L like IntelliJ)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyL,
      () => this.formatCode()
    );

    // Update stats
    this.updateStats();
  }

  onCodeChange(newCode: string) {
    this.javaCode.set(newCode);
    this.updateStats();
  }

  formatCode() {
    this.editor?.getAction('editor.action.formatDocument')?.run();
  }

  toggleTheme() {
    this.currentTheme.update(theme => theme === 'vs-dark' ? 'vs' : 'vs-dark');
  }

  updateFontSize() {
    this.editorOptions.update(options => ({
      ...options,
      fontSize: this.fontSize
    }));
  }

  loadTemplate(type: 'class' | 'interface' | 'main') {
    const templates = {
      class: `public class ClassName {
    private String field;

    public ClassName() {
        // Constructor
    }

    public void method() {
        // Method implementation
    }

    public static void main(String[] args) {
        ClassName instance = new ClassName();
    }
}`,
      interface: `public interface InterfaceName {
    void method();

    default void defaultMethod() {
        // Default implementation
    }
}`,
      main: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
    };

    this.javaCode.set(templates[type]);
  }

  private updateStats() {
    const code = this.javaCode();
    this.lineCount.set(code.split('\n').length);
    this.charCount.set(code.length);
  }
}
