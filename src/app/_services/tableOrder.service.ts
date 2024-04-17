import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {TableOrder} from '../_models/tableOrder';
import {OrderService} from './order.service';
import {forkJoin} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TableOrderService {
  constructor(private http: HttpClient,
              private orderService: OrderService) {
  }

  getAll(id: string) {
    return this.http.get<TableOrder[]>(`${environment.apiUrl}/tableOrder/getAll/${id}`);
  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/tableOrder/${id}`);
  }

  createItem(tableOrder: TableOrder) {
    console.log("In tableOrder.service createItem");
    const createOrder = this.orderService.createOrder(tableOrder.orderItems, tableOrder.tableName, tableOrder.tableUuid);
    const createTableOrder = this.http.post(`${environment.apiUrl}/tableOrder/register`, tableOrder);
    return forkJoin(createOrder, createTableOrder);
  }

  update(tableOrder: TableOrder) {
    return this.http.put(`${environment.apiUrl}/tableOrder/${tableOrder.id}`, tableOrder);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/tableOrder/${id}`);
  }

  getItemByTableUuid(tableUuid: string) {
    return this.http.get<TableOrder[]>(`${environment.apiUrl}/tableOrder/tableUuid/${tableUuid}`);
  }

  spliceOrderHistory(id: string, index: number) {
    const indexObject = {
      indexValue: index
    };
    return this.http.put(`${environment.apiUrl}/tableOrder/${id}`, indexObject);
  }

}
