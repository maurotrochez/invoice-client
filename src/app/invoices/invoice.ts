import {IItem} from '../items/item';

export interface IInvoice {
  InvoiceId: string;
  Consecutive: string;
  Total: number;
  Items: IItem[];
}
