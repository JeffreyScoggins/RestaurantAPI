import {Item} from './Item';

export class TableOrder {
  id: string;
  orgUuid: string;
  tableUuid: string;
  tableName: string;
  total: number;
  orderItems: Item[];
}

