import {Order} from './order';
import {Modifier} from './modifier';

export class OrderHistory {
  id: string;
  itemUuid: string;
  name: string;
  orgUuid: string;
  price: number;
  createdDate: Date;
  tableUuid: string;
  selectedOptions: string[];

  constructor(order: Order) {
    this.itemUuid = order.itemUuid;
    this.name = order.name;
    this.price = order.price;
    this.orgUuid = order.orgUuid;
    this.createdDate = order.createdDate;
    this.tableUuid = order.tableUuid;
    this.selectedOptions = order.selectedOptions;
  }
}
