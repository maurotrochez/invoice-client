import {IItem} from '../items/item';

export interface IInvoice {
  invoiceId: string;
  consecutive: string;
  total: number;
  items: IItem[];
}
