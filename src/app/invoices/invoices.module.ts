import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'invoices', component: InvoiceListComponent}
    ])
  ],
  declarations: [InvoiceListComponent]
})
export class InvoicesModule { }
