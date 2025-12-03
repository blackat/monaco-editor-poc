import {Component, signal} from '@angular/core';
import {JavaCodeEditorComponent} from './java-editor/java-editor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    JavaCodeEditorComponent
  ],
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
