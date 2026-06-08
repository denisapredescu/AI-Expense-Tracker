import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPageLayoutComponent } from './entity-page-layout.component';

describe('EntityPageLayoutComponent', () => {
  let component: EntityPageLayoutComponent;
  let fixture: ComponentFixture<EntityPageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityPageLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
