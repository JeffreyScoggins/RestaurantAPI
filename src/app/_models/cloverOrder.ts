import { LineItem } from './lineItem';

export class CloverOrder {
    id: string;
    currency: string;
    employee: {id:string};
    customers: any[];
    state: string;
    total: number;
    title: string;
    note: string;
    orderType: string;
    lineItems: LineItem[];
    device: {id:string};
  }
  