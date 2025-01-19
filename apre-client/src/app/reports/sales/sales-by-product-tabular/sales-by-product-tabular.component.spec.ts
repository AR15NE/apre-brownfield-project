import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesModule } from './sales/sales.module';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component'; 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


describe('SalesByProductTabularComponent', () => {
  let component: SalesByProductTabularComponent;
  let fixture: ComponentFixture<SalesByProductTabularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SalesModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByProductTabularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Sales by Product - Tabular"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Product - Tabular');
  });

  it('should initialize the productForm with a null value', () => {
    const productControl = component.productForm.controls['product'];
    expect(productControl.value).toBeNull();
    expect(productControl.valid).toBeFalse();
  });

  it('should not submit the form if no product is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.productForm.valid).toBeFalse();
  });
});
