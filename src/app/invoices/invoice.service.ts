import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../global';
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
    if (invoice.InvoiceId === '0') {
      return this.createInvoice(invoice, {headers: headers});
    }
    return this.updateInvoice(invoice, {headers: headers});
  }

  private createInvoice(invoice: IInvoice, options: {}): Observable<any> {
    invoice.InvoiceId = undefined;
    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, invoice, options)
      .do(data => {
        return data;
      })
      .catch(this.errorHandler);

  }

  private updateInvoice(invoice: IInvoice, options: {}): Observable<IInvoice> {
    return this.http.put(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${invoice.InvoiceId}`, invoice, options)
      .map(() => invoice)
      .do(data => {
        return data;
      })
      .catch(this.errorHandler);
  }

  deleteInvoice(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`;
    return this.http.delete(url)
      .do(data => console.log('deleteInvoice'))
      .catch(this.errorHandler);
  }

  private initializeInvoice(): IInvoice {
    return {
      InvoiceId: '0',
      Consecutive: '',
      Total: 0,
      ItemId: null
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
