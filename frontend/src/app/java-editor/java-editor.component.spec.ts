import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JavaEditorComponent} from './java-editor.component';

describe('JavaEditorComponent', () => {
  let component: JavaEditorComponent;
  let fixture: ComponentFixture<JavaEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavaEditorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JavaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
