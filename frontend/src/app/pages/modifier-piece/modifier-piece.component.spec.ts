import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierPieceComponent } from './modifier-piece.component';

describe('ModifierPieceComponent', () => {
  let component: ModifierPieceComponent;
  let fixture: ComponentFixture<ModifierPieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifierPieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
