import { Component, OnInit } from "@angular/core";
// import {TableOrderService} from '../_services/tableOrder.service';
import { CloverOrder } from "../_models/cloverOrder";
import { LineItem } from "../_models/lineItem";
import { CloverOrderService } from "../_services/cloverOrder.service";
import { User } from "../_models";
import { TableOrder } from "../_models/tableOrder";
import { first } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import {CloverApiService} from '../_services/cloverApi.service';
import Pusher from "pusher-js";

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.component.html",
  styleUrls: ["./order-history.component.scss"]
})
export class OrderHistoryComponent implements OnInit {
  currentUser: User;
  orderHistory: TableOrder[] = [];
  cloverOrder: CloverOrder;
  lineItems: LineItem[] = [];
  orderId: string;
  loading = true;
  tableUuid: string;
  tableName: string;
  localMerchantId: string;
  storedMerchantId: string;
  storedCloverToken: string;

  constructor(
    private cloverOrderService: CloverOrderService,
    private activatedRoute: ActivatedRoute,
    private cloverApiService: CloverApiService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    //    this.orderId = JSON.parse(localStorage.getItem('orderId'));
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      // this.tableUuid = params["tableUuid"];
      // this.tableName = params["tableName"];
      this.tableUuid = params['tableUuid'] ? params['tableUuid']: this.currentUser.username;
      this.tableName = params['tableName'] ? params['tableName']: this.currentUser.username;
    });
    this.loading = true;
    if (this.currentUser.role == "4") {
      this.tableName = this.currentUser.uuid;
    } 
    console.log("TableName :" + this.tableName);
    // if (this.tableName == undefined || this.tableName == null)
    // {
    //   this.tableName=this.currentUser.username;
    //   console.log("TableName =" + this.tableName);
    // }
    this.findUnpaidCloverOrder();
    // if (this.cloverOrder != undefined && this.cloverOrder != null) {
    //   this.orderId = this.cloverOrder.id;
    //   this.loadTableOrderItems();
    // } else 
    //   this.loading = false;
    console.log("in order-history OnInit"); //*MES*
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
            if(orders.elements[i].state != "paid")
            // if(orders.elements[i].paymentState != "PAID")
            // if (orders.elements[i]["paymentState"] == "OPEN" || 
            //               orders.elements[i]["paymentState"] == "PARTIALLY-PAID") 
              {
                console.log("Should run only once");
                this.cloverOrder = orders.elements[i];
                console.log(JSON.stringify(this.cloverOrder));
                this.orderId = this.cloverOrder.id;
                this.loadTableOrderItems();
                break;
              }
          }
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
    const localMerchantId = localStorage.getItem('merchant_id');

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

  /*    
  constructor(private tableOrderService: TableOrderService) {
    console.log('in order-history Constructor'); //*MES*
    this.loading = true;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const pusher = new Pusher('0fce1d9fc729dc6facf5', {
      cluster: 'mt1',
      forceTLS: true,
      contentType: JSON
    });

    const channel = pusher.subscribe('order-channel');
    channel.bind('tableOrder-added', data => {
      if (data.orgUuid === this.currentUser._id) {
        this.loadTableHistory();
      }
    });
  }

  ngOnInit() {
    console.log('in order-history OnInit'); //*MES*
    this.loadTableHistory();
  }

  private loadTableHistory() {
    this.tableOrderService.getItemByTableUuid(this.currentUser.uuid).pipe(first()).subscribe(order => {
      this.orderHistory = order;
      this.loading = false;
    });
  }
  */
}
