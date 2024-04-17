import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../_models';
import {environment} from '../../environments/environment.prod';
import {throwError} from 'rxjs';
import { ClientCredentials } from '../_models/clientCredentials';
import { CloverOrder } from '../_models/cloverOrder';
import { LineItem } from '../_models/lineItem';
import { Modification } from '../_models/modification';

@Injectable({ providedIn: 'root' })
export class CloverOrderService {

  constructor(private http: HttpClient) { }

  // postNewOrder() {
  //   console.log('in CloverOrderService post New Order'); //*MES*
  //   const body = {
  //     'merchant_id': localStorage.getItem('merchant_id'),
  //     'token': localStorage.getItem('clover_access_token'),
  //     'order': {"state":"open",}
  //   };
  //   return this.http.post<any>(`${environment.apiUrl}/cloverOrders/createOrder`, body);
  // }

  postNewOrder(order:JSON, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService post New Order'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'order': order
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/createOrder`, body);
  }

  getOrder(id: string, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService get Order'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'order_id': id
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/getOrder`, body);
  }


  updateOrder(id: string, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService update Order'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'order_id': id,
      'order': {"state":"paid"}
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/updateOrder`, body);
  }

  getUnpaidOrder(tableName: string, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService get Unpaid Order'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'filter': 'note='+tableName
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/getUnpaidOrder`, body);
  }

  getOrderLineItems(id: string, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService get Order & Lines : ' + id); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'order_id': id
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/getOrderLineItems`, body);
  }

  //not used as it gets all the orders and line items for a table.
  getOrdersAndLineItems(tableName: string, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService get Order & Lines : ' + tableName); //*MES*
    const body = {
      //'merchant_id': localStorage.getItem('merchant_id'),
      'merchant_id': merchantId,
      'token': cloverToken,
      'note': tableName
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/getOrdersAndLineItems`, body);
  }

  postNewLineItem(id:string, lineItem: LineItem, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService post New LineItem'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'order_id': id,
      'line_item': lineItem
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/createLineItem`, body);
  }

  deleteLineItem(id:string, lineItemId: string, merchantId: string, cloverToken: string) {
    console.log('in CloverOrderService delete LineItem'); //*MES*
    const body = {
      'merchant_id': merchantId,
      'token': cloverToken,
      'order_id': id,
      'lineItem_id': lineItemId
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/deleteLineItem`, body);
  }

  postNewModification(id:string, lineItemID: string, modification: Modification, merchantID: string, cloverToken: string) {
    console.log('in CloverOrder.service add  new modification'); //*MES*
    const body = {
      //'merchant_id': localStorage.getItem('merchant_id'),
      'merchant_id': merchantID,
      'token': cloverToken,
      'order_id': id,
      'lineitem_id': lineItemID,
      'modification': modification
    };
    return this.http.post<any>(`${environment.apiUrl}/cloverOrders/createItemModification`, body);
  }
}
