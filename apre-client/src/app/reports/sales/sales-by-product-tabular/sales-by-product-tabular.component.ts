import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from './../../../shared/table/table.component';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sales-by-product-tabular',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, TableComponent],
  template: `
    <h1>Sales by Product - Tabular</h1>
    <div class="product-container">
      <form class="form" [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="product">Product</label>
          <select class="select" formControlName="product" id="product" name="product">
            <option value="">Select Product</option>
            @for(product of products; track product) {
              <option value="{{ product }}">{{ product }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (salesData.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Sales by Product - Tabular'"
            [data]="salesData"
            [headers]="['Product', 'Sales Person', 'Total Sales']"
            [sortableColumns]="['Sales Person', 'Total Sales']"
            [headerBackground]="'secondary'"
            >
          </app-table>
        </div>
      }
    </div>
  `,
  styles: `
    .product-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
      padding: 10px;
    }

    app-table {
      padding: 50px;
    }
  `
})
export class SalesByProductTabularComponent implements OnInit {
  salesData: any[] = [];
  products: string[] = [];

  productForm = this.fb.group({
    product: [null, Validators.compose([Validators.required])]
  });

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiBaseUrl}/reports/sales/products`).subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  onSubmit() {
    const product = this.productForm.controls['product'].value;
    this.http.get(`${environment.apiBaseUrl}/reports/sales/products/${product}`).subscribe({
      next: (data: any) => {
        this.salesData = data;
        for (let data of this.salesData) {
          data['Product'] = product;
          data['Total Sales'] = data['totalSales'];
          data['Sales Person'] = data['salesperson'];
        }

        console.log('Sales data:', this.salesData);
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      }
    });
  }
}
