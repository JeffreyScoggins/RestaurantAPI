import { Component, OnInit } from '@angular/core';
import {OrderService} from '../_services/order.service';
import {Order} from '../_models/order';
import {first} from 'rxjs/operators';
import Pusher from 'pusher-js';
import {TableOrder} from '../_models/tableOrder';
import * as _ from 'lodash';
import {User} from '../_models';

@Component({
  selector: 'app-waiter-ready-order-view',
  templateUrl: './waiter-ready-order-view.component.html',
  styleUrls: ['./waiter-ready-order-view.component.scss']
})
export class WaiterReadyOrderViewComponent implements OnInit {

  orders: Order[] = [];
  typeDropdown = 'items';
  loadingButton = false;
  orderHistory: TableOrder[] = [];
  orderTables: string[] = [];
  viewAsList = true;
  currentUser: User;
  loading = true;
  id: string;

  constructor(private orderService: OrderService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const pusher = new Pusher('0fce1d9fc729dc6facf5', {
      cluster: 'mt1',
      forceTLS: true,
      contentType: JSON
    });

    const channel = pusher.subscribe('order-ready');
    channel.bind('order-ready-created', data => {
      if (data.orgUuid === this.currentUser._id) {
        this.orders.push(data);
      }
    });
  }

  ngOnInit() {
    this.loadAllOrders();
  }

  loadAllOrders() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.orderService.getAll(id).pipe(first()).subscribe(order => {
      this.orders = order;
      this.orders = _.filter(this.orders, function(o) {
        return o.status === 'complete';
      });
      this.orderTables = this.orders.map(function(table) { return table.tableName; });
      this.orderTables = this.orderTables.filter((el, i, a) => i === a.indexOf(el));
      this.loading = false;
      this.loadingButton = false;
    });
  }

  statusChangeButtonClick(order: Order) {
    this.loadingButton = true;
    if (order.status === 'submitted') {
      order.status = 'started';
      this.orderService.update(order).pipe(first()).subscribe(() => {
        // this.receiveMessage(this.id);
      });
    } else if (order.status === 'started') {
      order.status = 'complete';
      this.orderService.update(order).pipe(first()).subscribe(() => {
       // this.receiveMessage(this.id);
      });
    } else if (order.status === 'complete') {
      this.orderService.delete(order).pipe(first()).subscribe(() => {
       // this.receiveMessage(this.id);
        _.remove(this.orders, order);
      });
    }
  }

  onValChange(value) {
    this.loadAllOrders();
    this.typeDropdown = value;
  }

  receiveMessage($event) {
    if ($event) {
      this.id = $event;
      this.loadHistoryByCategoryOrItem($event);
    } else {
      this.loadAllOrders();
    }
  }

  private loadHistoryByCategoryOrItem(searchBy: string) {
    this.orders = [];
    if (this.typeDropdown === 'categories') {
      this.orderService.getItemsByCategoryUuid(searchBy, this.currentUser._id).pipe(first()).subscribe(order => {
        this.orders = order;
        this.orders = _.filter(this.orders, function(o) {
          return o.status === 'complete';
        });
        this.orderTables = this.orders.map(function(table) { return table.tableName; });
        this.orderTables = this.orderTables.filter((el, i, a) => i === a.indexOf(el));
      });
    } else if (this.typeDropdown === 'items') {
      this.orderService.getItemsByItemUuid(searchBy, this.currentUser._id).pipe(first()).subscribe(order => {
        this.orders = order;
        this.orders = _.filter(this.orders, function(o) {
          return o.status === 'complete';
        });
        this.orderTables = this.orders.map(function(table) { return table.tableName; });
        this.orderTables = this.orderTables.filter((el, i, a) => i === a.indexOf(el));
      });
    }
  }

  ordersByTableName(tableName: string) {
    return _.filter(this.orders, function(o) {
      return o.tableName === tableName;
    });
  }
}
