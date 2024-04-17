import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {OrderHistory} from '../_models/orderHistory';
import {Order} from '../_models/order';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderHistoryService {

  orderHistory: Observable<OrderHistory[]>;

  constructor(private http: HttpClient) {
  }

  getAll(id: string) {
    const response = this.http.get<OrderHistory[]>(`${environment.apiUrl}/orderHistory/getAll/${id}`);
    return response;
  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/orderHistory/${id}`);
  }

  getByDate(startDate: Date, endDate: Date) {
    return this.http.get<OrderHistory[]>(`${environment.apiUrl}/orderHistory/date/${startDate}/${endDate}`);
  }

  createOrder(order: Order) {
    const orderHistory = new OrderHistory(order);
    return this.http.post(`${environment.apiUrl}/orderHistory/register`, orderHistory);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/orderHistory/${id}`);
  }

  update(order: OrderHistory) {
    return this.http.put(`${environment.apiUrl}/orderHistory/${order.id}`, order);
  }

  getItemsByCategoryUuid(categoryUuid: string) {
    return this.http.get<OrderHistory[]>(`${environment.apiUrl}/orderHistory/categoryUuid/${categoryUuid}`);
  }

  getItemsByItemUuid(itemUuid: string) {
    return this.http.get<OrderHistory[]>(`${environment.apiUrl}/orderHistory/itemUuid/${itemUuid}`);
  }
}

