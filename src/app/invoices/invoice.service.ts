import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../global';
import {IItem} from '../items/item';
import {IInvoice} from './invoice';

@Injectable()
export class InvoiceService {
  private baseUrl = 'api/invoices';

  constructor(private http: HttpClient) {
  }

  getInvoices(): Observable<IInvoice[]> {
    return this.http
      .get<IInvoice[]>(`${AppSettings.API_ENDPOINT}${this.baseUrl}`)
      .catch(this.errorHandler);
  }

  getInvoice(id: string): Observable<IInvoice> {
    if (id === '0') {
      return Observable.of(this.initializeInvoice());
    }
    return this.http
      .get<IInvoice>(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`)
      .do(data => console.log('getInvoice:' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  saveInvoice(invoice: IInvoice): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    if (invoice.invoiceId === '0') {
      return this.createInvoice(invoice, {headers: headers});
    }
    return this.updateInvoice(invoice, {headers: headers});
  }

  private createInvoice(invoice: IInvoice, options: {}): Observable<any> {
    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, invoice, options)
      .do(data => {
        return data;
      })
      .catch(this.errorHandler);

  }

  private updateInvoice(invoice: IInvoice, options: {}): Observable<IInvoice> {
    return this.http.put(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, invoice, options)
      .map(() => invoice)
      .do(data => {
        return data;
      })
      .catch(this.errorHandler);
  }

  private initializeInvoice(): IInvoice {
    return {
      invoiceId: null,
      consecutive: '',
      total: 0,
      items: []
    };
  }

  private errorHandler(error: HttpErrorResponse) {
    // console.error(error);
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = error.error.message;
    }
    return Observable.throw(errorMessage);
  }

}
