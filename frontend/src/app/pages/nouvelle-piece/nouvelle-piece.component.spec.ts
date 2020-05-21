import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvellePieceComponent } from './nouvelle-piece.component';

describe('NouvellePieceComponent', () => {
  let component: NouvellePieceComponent;
  let fixture: ComponentFixture<NouvellePieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouvellePieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvellePieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
