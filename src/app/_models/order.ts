import {Item} from './Item';
import {Modifier} from './modifier';

export class Order {
  id: string;
  itemUuid: string;
  orgUuid: string;
  name: string;
  price: number;
  categoryUuid: string;
  status: string;
  createdDate: Date;
  tableUuid: string;
  tableName: string;
  containsOptions: boolean;
  selectedOptions: string[];
  //*MES*
  state: string;
  total: number;


  constructor(item: Item, tableName: string, tableUuid: string) {
  //  this.orgUuid = item.orgUuid;
    this.itemUuid = item.id;
    this.name = item.name;
    this.price = item.price;
    this.total = item.price;
    this.state = "open";
 //   this.categoryUuid = item.categoryUuid;
    this.tableName = tableName;
    this.tableUuid = tableUuid;
  //  this.containsOptions = item.containsOptions;
  //  this.selectedOptions = item.selectedOptions;
  }
}
