import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {IItem} from './item';
import {AppSettings} from '../global';
import {v4 as uuid} from 'uuid';

@Injectable()
export class ItemService {
  private baseUrl = 'api/items';

  constructor(private http: HttpClient) {
  }

  getItems(): Observable<IItem[]> {
    return this.http
      .get<IItem[]>(`${AppSettings.API_ENDPOINT}${this.baseUrl}`)
      .catch(this.errorHandler);
  }

  getItem(id: string): Observable<IItem> {
    if (id === '0') {
      return Observable.of(this.initializeItem());
    }
    return this.http
      .get<IItem>(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`)
      .do(data => console.log('getItem:' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  saveItem(item: IItem): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    if (item.ItemId === '0' || item.ItemId === null) {
      return this.createItem(item, {headers: headers});
    }
    return this.updateItem(item, {headers: headers});
  }

  private createItem(item: IItem, options: {}): Observable<any> {
    item.ItemId = undefined;
    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, item, options)
      .do(data => {
        return data;
      })
      .catch(this.errorHandler);

  }

  private updateItem(item: IItem, options: {}): Observable<IItem> {
    return this.http.put(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${item.ItemId}`, item, options)
      .map(() => item)
      .do(data => {
        return data;
      })
      .catch(this.errorHandler);
  }

  deleteItem(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`;
    return this.http.delete(url)
      .do(data => console.log('deleteItem'))
      .catch(this.errorHandler);
  }

  private initializeItem(): IItem {
    return {
      ItemId: '0',
      Code: '',
      Name: '',
      Value: 0
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
