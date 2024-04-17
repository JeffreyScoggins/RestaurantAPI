import { Component, OnInit } from '@angular/core';
import {OrderService} from '../_services/order.service';
import {Order} from '../_models/order';
import {first} from 'rxjs/operators';
import Pusher from 'pusher-js';
import {TableOrder} from '../_models/tableOrder';
import * as _ from 'lodash';
import {User} from '../_models';
import { CloverApiService } from '../_services/cloverApi.service';
import { ClientCredentials } from '../_models/clientCredentials';
import { CloverAuthenticationService } from '../_services/cloverAuthentication.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {

  orders: Order[] = [];
  typeDropdown = 'items';
  loadingButton = false;
  orderHistory: TableOrder[] = [];
  loading = true;
  currentUser: User;
  orderTables: string[] = [];
  viewAsList = true;
  id: string;
  client_id: string;
  code: string;
  merchant_id: string;
  categoriesFirstMerchants: string[];
  categoriesFirstSwitch: boolean;

  constructor(private orderService: OrderService, private cloverApiService: CloverApiService, private cloverTokenService: CloverAuthenticationService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const pusher = new Pusher('0fce1d9fc729dc6facf5', {
      cluster: 'mt1',
      forceTLS: true,
      contentType: JSON
    });

    const channel = pusher.subscribe('order-channel');
    channel.bind('new-order', data => {
      if (data.added === true && data.orgUuid === this.currentUser._id) {
        this.receiveMessage(this.id);
      }
    });
    console.log('in view-orders Const'); //*MES*
  }

  ngOnInit() {
    this.loadAllOrders();
    this.initialRouterPropertiesSet();
    console.log('in view-orders OnInit'); //*MES*
  }

  loadAllOrders() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.orderService.getAll(id).pipe(first()).subscribe(order => {
      this.orders = order;
      this.orders = _.filter(this.orders, function(o) {
        return o.status !== 'complete';
      });
      this.orderTables = this.orders.map(function(table) { return table.tableName; });
      this.orderTables = this.orderTables.filter((el, i, a) => i === a.indexOf(el));
      this.loading = false;
      this.loadingButton = false;
    });
  }

  initialRouterPropertiesSet() {
    console.log('In home component - initialRouterPropertiesSet'); //*MES*
    const url_string = window.location.href;
    const url = new URL(url_string);
    console.log('url_string:' + url_string); //*MES*
    const credentials = new ClientCredentials();
    
    this.merchant_id = url.searchParams.get('merchant_id');
    this.client_id = url.searchParams.get('client_id');
    this.code = url.searchParams.get('code');

    credentials.merchantId = this.merchant_id;
    credentials.clientId = this.client_id;
    
    this.cloverTokenService.login(this.merchant_id, this.client_id, this.code).pipe(first())
      .subscribe(
        data => {
          credentials.cloverToken = data.access_token;
          this.cloverApiService.SaveClientCredentials(credentials).pipe(first()).subscribe(
            success => {
           
            }
          );
        },
        error => {
          console.log(error);
        });

    if (!_.isNil(this.merchant_id)) {
      localStorage.setItem('merchant_id', this.merchant_id);
    }
    if (this.categoriesFirstMerchants.includes(localStorage.getItem('merchant_id')))
      this.categoriesFirstSwitch = true;
  }
    

  ordersByTableName(tableName: string) {
    return _.filter(this.orders, function(o) {
      return o.tableName === tableName;
    });
  }

  statusChangeButtonClick(order: Order) {
    this.loadingButton = true;
    if (order.status === 'submitted') {
      order.status = 'started';
      this.orderService.update(order).pipe(first()).subscribe(() => {
        // this.receiveMessage(this.id);
        this.orders = _.filter(this.orders, function(o) {
          return o.status !== 'complete';
        });
      });
    } else if (order.status === 'started') {
      order.status = 'complete';
      this.orderService.update(order).pipe(first()).subscribe(() => {
        // this.receiveMessage(this.id);
        this.orders = _.filter(this.orders, function(o) {
          return o.status !== 'complete';
        });
      });
    } else if (order.status === 'complete') {
      this.orderService.delete(order).pipe(first()).subscribe(() => {
       // this.receiveMessage(this.id);
        this.orders = _.filter(this.orders, function(o) {
          return o.status !== 'complete';
        });
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
      console.log('view-order loadHistoryByCategory')
      this.orderService.getItemsByCategoryUuid(searchBy, this.currentUser._id).pipe(first()).subscribe(order => {
        this.orders = order;
        this.orders = _.filter(this.orders, function(o) {
          return o.status !== 'complete';
        });

        this.orderTables = this.orders.map(function(table) { return table.tableName; });
        this.orderTables = this.orderTables.filter((el, i, a) => i === a.indexOf(el));
      });
    } else if (this.typeDropdown === 'items') {
      console.log('view-order loadHistoryByItem')
      this.orderService.getItemsByItemUuid(searchBy, this.currentUser._id).pipe(first()).subscribe(order => {
        this.orders = order;
        this.orders = _.filter(this.orders, function(o) {
          return o.status !== 'complete';
        });
        this.orderTables = this.orders.map(function(table) { return table.tableName; });
        this.orderTables = this.orderTables.filter((el, i, a) => i === a.indexOf(el));
      });
    }
  }
}
