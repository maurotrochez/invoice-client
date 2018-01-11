import { Component, OnInit } from '@angular/core';
import {IItem} from '../items/item';
import {IInvoice} from './invoice';
import {InvoiceService} from './invoice.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  pageTitle = 'Invoices list';
  invoices: IInvoice[];
  errorMessage: string;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.invoiceService.getInvoices().subscribe(
      data => this.invoices = data,
      error => this.errorMessage = error
    );
  }

}
