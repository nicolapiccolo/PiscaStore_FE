import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAuthorComponent } from './product-author.component';

describe('ProductAuthorComponent', () => {
  let component: ProductAuthorComponent;
  let fixture: ComponentFixture<ProductAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAuthorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
