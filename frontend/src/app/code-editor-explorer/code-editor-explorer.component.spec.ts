import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CodeEditorExplorerComponent} from './code-editor-explorer.component';

describe('CodeEditorExplorerComponent', () => {
  let component: CodeEditorExplorerComponent;
  let fixture: ComponentFixture<CodeEditorExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeEditorExplorerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CodeEditorExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
