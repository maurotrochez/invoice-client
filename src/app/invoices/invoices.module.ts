import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list.component';
import {RouterModule} from '@angular/router';
import {InvoiceService} from './invoice.service';
import { InvoiceEditComponent } from './invoice-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'invoices', component: InvoiceListComponent},
      {path: 'invoicesEdit/:id', component: InvoiceEditComponent}
    ])
  ],
  declarations: [InvoiceListComponent, InvoiceEditComponent],
  providers: [InvoiceService]
})
export class InvoicesModule { }
