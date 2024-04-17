import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Item} from '../_models/Item';
import {Order} from '../_models/order';
import {forkJoin} from 'rxjs';
import {OrderHistoryService} from './orderHistory.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  constructor(private http: HttpClient, private orderHistoryService: OrderHistoryService) {
  }

  getAll(id: string) {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/getAll/${id}`);
  }

  getOrderTime(id: string) {
    return this.http.get<string>(`${environment.apiUrl}/orders/orderTime/${id}`);

  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/orders/${id}`);
  }

  createOrder(items: Item[], tableName: string, tableUuid: string) {
    console.log("in order.service createOrder");
    const orders: Order[] = items.map(item => new Order(item, tableName, tableUuid));
    console.log(orders);
  //  return this.http.post(`${environment.apiUrl}/orders/register`, orders);
    return this.http.post(`${environment.apiUrl}/cloverOrders/register`, orders);
    
  }

  delete(order: Order) {
    const deleteOrder = this.http.delete(`${environment.apiUrl}/orders/${order.id}`);
    const createOrderHistory = this.orderHistoryService.createOrder(order);
    return forkJoin(createOrderHistory, deleteOrder);
  }

  update(order: Order) {
    return this.http.put(`${environment.apiUrl}/orders/${order.id}`, order);
  }

  getItemsByCategoryUuid(categoryUuid: string, orgUuid: string) {
    console.log('in order.service getItemsByCategory');
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/categoryUuid/${categoryUuid}/${orgUuid}`);
  }

  getItemsByItemUuid(itemUuid: string, orgUuid: string) {
    console.log('in order.service getItemsByItem');
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/itemUuid/${itemUuid}/${orgUuid}`);
  }
}

