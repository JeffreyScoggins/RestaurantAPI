import {Component, OnInit} from '@angular/core';
import {TableOrderService} from '../_services/tableOrder.service';
import {TableOrder} from '../_models/tableOrder';
import { CloverOrder } from "../_models/cloverOrder";
import { LineItem } from "../_models/lineItem";
import { CloverOrderService } from "../_services/cloverOrder.service";
import { ActivatedRoute } from "@angular/router";
import { CloverApiService} from '../_services/cloverApi.service';
import {UserService} from '../_services';

import {first} from 'rxjs/operators';
import Pusher from 'pusher-js';
import {User} from '../_models';
import * as _ from 'lodash';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {NotificationConfirmationComponentComponent} from '../notification-confirmation-component/notification-confirmation-component.component';

@Component({
  selector: 'app-table-summary',
  templateUrl: './table-summary.component.html',
  styleUrls: ['./table-summary.component.scss']
})
export class TableSummaryComponent implements OnInit {

  tables: User[] = [];

  orderHistory: TableOrder[] = [];
  currentUser: User;
  id: string;
  
  cloverOrder: CloverOrder;
  lineItems: LineItem[] = [];
  orderId: string;
  loading = true;
  tableUuid: string;
  tableName: string;
  localMerchantId: string;
  storedMerchantId: string;
  storedCloverToken: string;
  tableSelected: boolean = false;
  foundOrder: boolean = false;

 
  constructor(private tableOrderService: TableOrderService, private dialog: MatDialog,
    private userService: UserService,
    private cloverOrderService: CloverOrderService,
 //   private activatedRoute: ActivatedRoute,
    private cloverApiService: CloverApiService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.id = this.currentUser.uuid;
    this.tableSelected = false;

    // const pusher = new Pusher('0fce1d9fc729dc6facf5', {
    //   cluster: 'mt1',
    //   forceTLS: true,
    //   contentType: JSON
    // });

    // const channel = pusher.subscribe('order-channel');
    // channel.bind('tableOrder-added', data => {
    //   console.log("order channel : " + data.orgUuid + "currentUser._id :" + this.currentUser._id);
    //   if (data.orgUuid === this.currentUser._id) {
    //     this.loadAllTableEntries(this.id);
    //   }
    // });
  }

  ngOnInit() {
    this.getAllTables();
  }

  getAllTables() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.userService.getAll(id).pipe(first()).subscribe((tables) => {
      this.tables = tables;
      this.tables = _.filter(this.tables, function(o) {
        return o.role === '3';
      });
      this.loading = false;
    });
  }

  onTableSelect(tableName: string) {
    this.loading = true;
    console.log("Tablename :" + tableName);
    this.tableSelected = true;
    this.tableName = tableName;
    this.cloverOrder = null;
    this.orderId = null;
    this.lineItems = [];
    if (tableName != 'Select a Table')
      {
        this.tableSelected = true;
        this.findUnpaidCloverOrder();
      }
    else
    this.tableSelected = false;
  }


  findUnpaidCloverOrder() {
    const localMerchantId = localStorage.getItem('merchant_id');
    
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
      this.storedMerchantId = id;
  
      this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
        token => {
        this.storedCloverToken = token;
      
      this.cloverOrderService.getUnpaidOrder(this.tableName, this.storedMerchantId, this.storedCloverToken).pipe(first()).subscribe(
        orders => {
          console.log("No of orders returned :" + orders.elements.length);
          for (var i=0; i < orders.elements.length; i++) {
            console.log(JSON.stringify(orders.elements[i].state));
            // if (orders.elements[i]["paymentState"] != "PAID") 
            if(orders.elements[i].state != "paid")
            // if (orders.elements[i]["paymentState"] == "OPEN" || 
                // orders.elements[i]["paymentState"] == "PARTIALLY-PAID") 
              {
                console.log("Should run only once");
                this.cloverOrder = orders.elements[i];
                console.log(JSON.stringify(this.cloverOrder));
                this.orderId = this.cloverOrder.id;
                this.loadTableOrderItems();
                break;
              }
          }
          if (orders.elements.length == 0 || this.cloverOrder == null)
            this.loading = false;
          console.log("End of UpaidCloverOrder");
        });
      },
    )},
      error => {
          console.log(error);
      });
    return;
  }
  
  private loadTableOrderItems() {
    this.lineItems = [];
    this.loading = true;
    const localMerchantId = localStorage.getItem('merchant_id');
  //  this.loading = true;
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
      this.storedMerchantId = id;
  
      this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
        token => {
        this.storedCloverToken = token;
  
      this.cloverOrderService.getOrderLineItems(this.orderId, this.storedMerchantId, this.storedCloverToken).pipe(first()).subscribe(
        order => {
        Object.assign(this.lineItems, order.elements);
        console.log(JSON.stringify(this.lineItems));
        this.loading = false;
      });
    },
  )},
      error => {
          console.log(error);
      });  
  }
  
  public getTotalAmount() {
    let total = 0;
    this.lineItems.forEach(lineItem => {
      total += lineItem.price;
      if (lineItem.hasOwnProperty('modifications'))
      {
        // console.log("lineitem modifications :", lineItem.modifications);
        if (lineItem.modifications.elements.length > 0)
        {
          lineItem.modifications.elements.forEach(modification => {
            total +=modification.amount;
          })
        }
      }
    });
    return total; 
  }

  deleteActionHandle(index: number) {
    // const message = 'Are you sure you want to delete item ' + this.orderHistory[0].orderItems[index].name + ' from the table';
    const message = 'Are you sure you want to delete item ' + this.lineItems[index].name + ' from the table';
    this.openOptions(message, index);
  }

  openOptions(message: string, index: number) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: message,
      title: 'Confirm Delete'
    };

    const dialogRef = this.dialog.open(NotificationConfirmationComponentComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.deleteOrderItemAtIndex(index);
        }
      });
  }


  deleteOrderItemAtIndex(index: number) {
    
    console.log("Item to be deleted :", this.lineItems[index]);
    const localMerchantId = localStorage.getItem('merchant_id');
    this.loading = true;
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
      this.storedMerchantId = id;
  
      this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
        token => {
        this.storedCloverToken = token;
  
      this.cloverOrderService.deleteLineItem(this.orderId, this.lineItems[index].id, this.storedMerchantId, this.storedCloverToken).pipe(first()).subscribe(
        order => {
        console.log(JSON.stringify(order));
        this.loadTableOrderItems();
      });
      },
      )},
      error => {
          console.log(error);
      }); 
      
  }

  clearTableHistory() {
    this.lineItems = [];
    this.findCloverOrder(this.orderId);
    console.log('table cleared');


  }

  findCloverOrder(id: string) {
    const localMerchantId = localStorage.getItem("merchant_id");
    this.cloverApiService
      .GetMerchantId(localMerchantId)
      .pipe(first())
      .subscribe(
        merchantid => {
          this.storedMerchantId = merchantid;

          this.cloverApiService
            .GetCloverToken(this.storedMerchantId)
            .pipe(first())
            .subscribe(token => {
              this.storedCloverToken = token;

              this.cloverOrderService
                // .getOrder(id, this.storedMerchantId, this.storedCloverToken)
                .updateOrder(id, this.storedMerchantId, this.storedCloverToken)
                .pipe(first())
                .subscribe(order => {
                  this.cloverOrder = order;
                  console.log("Order found to delete :" + JSON.stringify(this.cloverOrder));
                  this.cloverOrder = null;
                  this.orderId = null;
                  this.findUnpaidCloverOrder();
                });
            });
        },
        error => {
          console.log(error);
        }
      );
    console.log("am i waiting?");
    return;
  }

  /*

  loadAllTableEntries(id: string) {
    this.tableOrderService.getItemByTableUuid(id).pipe(first()).subscribe(order => {
      this.orderHistory = order;
    });
  }



  clearTableHistory() {
    this.tableOrderService.delete(this.orderHistory[0].id).subscribe(() => {
      this.orderHistory.splice(0, 1);
    });
  }


  onTableSelect(tableUuid: string) {
    this.orderHistory = [];
    this.id = tableUuid;
    this.loadAllTableEntries(tableUuid);
  }

  deleteOrderItemAtIndex(index: number) {
    const cloneHistory = _.cloneDeep(this.orderHistory[0]);
    cloneHistory.orderItems.splice(index, 1);
    cloneHistory.total -= this.orderHistory[0].orderItems[index].price;
    this.tableOrderService.update(cloneHistory).pipe(first()).subscribe(() => {
      this.orderHistory = [];
      this.loadAllTableEntries(this.id);
    });  
  }
  */

    // this.tableOrderService.update(cloneHistory).pipe(first())
    //   .subscribe(
    //     data => {
    //       this.orderHistory[0].orderItems.splice(index, 1);
    //     },
    //     error => {
    //       console.error(error);
    //     });
}