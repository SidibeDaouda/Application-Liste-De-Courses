import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecesVueComponent } from './pieces-vue.component';

describe('PiecesVueComponent', () => {
  let component: PiecesVueComponent;
  let fixture: ComponentFixture<PiecesVueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiecesVueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiecesVueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
