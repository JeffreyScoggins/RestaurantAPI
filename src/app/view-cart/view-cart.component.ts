import { Component, OnInit } from "@angular/core";
import { CartService } from "../_services/cart.service";
import { first } from "rxjs/operators";
import { Item } from "../_models/Item";
import { TableOrderService } from "../_services/tableOrder.service";
import { TableOrder } from "../_models/tableOrder";
import { CloverOrderService } from "../_services/cloverOrder.service";
import { CloverOrder } from "../_models/cloverOrder";
import { User } from "../_models";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../_services";
import { LineItem } from "../_models/lineItem";
import { CloverApiService } from "../_services/cloverApi.service";
import {ccAuth} from '../../app/_services/ccAuth';
import {addTipComponent} from '../add-tip/add-tip.component';
import {CloverConnector} from 'remote-pay-cloud/dist/definitions/com/clover/remote/client/CloverConnector';
import {forEach} from '@angular/router/src/utils/collection';


@Component({
  selector: "app-view-cart",
  templateUrl: "./view-cart.component.html",
  styleUrls: ["./view-cart.component.scss"]
})
export class ViewCartComponent implements OnInit {
  currentUser: User;
  lineItems: LineItem[] = [];
  loading = true;
  loadingButton = false;
  tableUuid: string;
  tableName: string;
  categoryUuid: string;
  cloverOrder: CloverOrder = null;
  orderId: string;
  orderNew = true;
  total: number;
  localMerchantId: string;
  storedMerchantId: string;
  storedCloverToken: string;


  constructor(
    private cartService: CartService,
    private cloverOrderService: CloverOrderService,
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private cloverApiService: CloverApiService,
    private ccauth: ccAuth,
    private addTip: addTipComponent,

  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("View Cart Component Constructor");
    ccauth.cleanup();
    ccauth.connect();
    //   this.orderId = JSON.parse(localStorage.getItem('orderId'));

    }

  ngOnInit() {
    console.log("View Cart Component OnInit ");
    this.activatedRoute.params.subscribe(params => {
      // this.tableUuid = params["tableUuid"];
      // this.tableName = params["tableName"];
      this.tableUuid = params['tableUuid'] ? params['tableUuid']: this.currentUser.username;
      this.tableName = params['tableName'] ? params['tableName']: this.currentUser.username;
      this.categoryUuid = params["categoryUuid"];
    });
    this.loadAllInCart();

  }

  loadAllInCart() {
    console.log("View Cart Component load all in cart ");
    this.cartService
      .getItems()
      .pipe(first())
      .subscribe(lineItem => {
        console.log("View Cart Component lineitem :", lineItem );
        this.lineItems = lineItem;
        this.findUnpaidCloverOrder();
      });
  }

  deleteItemFromCart(lineItem: LineItem) {
    this.loadingButton = true;
    this.cartService.removeFromCart(lineItem);
    this.loadAllInCart();
  }

  getCartTotal() {
    this.total = this.cartService.getTotalAmount();
    return this.total;
  }

  submitOrder() {
    this.ccauth.setPrint(this.lineItemsToString(this.lineItems));
    this.loadingButton = true;
    console.log("clover order = " + this.orderId);
    if (this.currentUser.role == "4") {
      this.tableName = this.currentUser.uuid;
      this.createNewCloverOrder();
      this.ccauth.Total(this.getCartTotal());
      this.addTip.setTotalAmount(this.getCartTotal());
      console.log('Cart Total Amount: ' + this.getCartTotal());


    } else {
 //     this.tableName = this.currentUser.username;
      if (
        this.orderId == "undefined" ||
        this.orderId == null ||
        this.orderId == ""
      ) {
        this.createNewCloverOrder();
      } else {
        this.findCloverOrder(this.orderId);
      }
    }
   // this.orderPlaced();
  }
  lineItemsToString(lineItems: LineItem[]){
    let itemArray = [];
    let stringItem = "";
    for( let i = 0; i < lineItems.length; i++ ){
      stringItem = lineItems[i].name.toString();
      itemArray[i] = stringItem;
    }
    return itemArray;
  }

  findUnpaidCloverOrder() {
    console.log(
      "view-cart: findunpaidCloverOrder tableName: " + this.tableName
    );

    if (this.tableName == undefined || this.tableName == null) {
      console.log("Table name cannot be undefined!");
      this.loading = false;
      this.loadingButton = false;
      return;
    }

    const localMerchantId = localStorage.getItem("merchant_id");
    this.cloverApiService
      .GetMerchantId(localMerchantId)
      .pipe(first())
      .subscribe(
        id => {
          this.storedMerchantId = id;

          this.cloverApiService
            .GetCloverToken(this.storedMerchantId)
            .pipe(first())
            .subscribe(token => {
              this.storedCloverToken = token;

              this.cloverOrderService
                .getUnpaidOrder(
                  this.tableName,
                  this.storedMerchantId,
                  this.storedCloverToken
                )
                .pipe(first())
                .subscribe(orders => {
                  console.log(JSON.stringify(orders));
                  for (var i = 0; i < orders.elements.length; i++) {
                    console.log(JSON.stringify(orders.elements.state));
                    // if (orders.elements[i]["paymentState"] != "PAID")
                    if (orders.elements[i]["state"] != "paid")
                      // if (orders.elements[i]["paymentState"] == "OPEN" ||
                      //     orders.elements[i]["paymentState"] == "PARTIALLY-PAID")
                      {
                        this.cloverOrder = orders.elements[i];
                        console.log(JSON.stringify(this.cloverOrder));
                        this.orderId = this.cloverOrder.id;
                        break;
                       }
                  }
                  this.loading = false;
                  this.loadingButton = false;
                  console.log("FindUpaidCloverOrder");
                });
            });
        },
        error => {
          console.log(error);
        }
      );

    return;
  }

  // async createNewCloverOrder(){
  //   var cloverOrder: CloverOrder;
  //   await this.cloverOrderService.postNewOrder().then(order => {
  //     console.log(JSON.stringify(order));
  // //    this.orderId = cloverOrder.id;
  // //    localStorage.setItem('orderId', JSON.stringify(this.orderId));
  // //    this.addLineItems();
  //   });
  //   console.log("I'm back!");
  //   return;
  // }

  createNewCloverOrder() {
    const order = '{"state":"open",' +
                  '"paymentState":"OPEN",' +
                  '"note":"' + this.tableName +
  //                '", "total":' + this.total + '}';
                  '"}';
    //                '", "total":' + this.total + '}';
    console.log(JSON.parse(order));

    const localMerchantId = localStorage.getItem("merchant_id");
    this.cloverApiService
      .GetMerchantId(localMerchantId)
      .pipe(first())
      .subscribe(
        merchantId => {
          this.storedMerchantId = merchantId;

          this.cloverApiService
            .GetCloverToken(this.storedMerchantId)
            .pipe(first())
            .subscribe(token => {
              this.storedCloverToken = token;
              console.log('order is: ' +order);
              this.cloverOrderService
                .postNewOrder(
                  JSON.parse(order),
                  this.storedMerchantId,
                  this.storedCloverToken
                )
                .pipe(first())
                .subscribe(data => {
                  this.cloverOrder = data;
                  console.log(JSON.stringify(data));
                  this.orderId = this.cloverOrder.id;
                  //     localStorage.setItem('orderId', JSON.stringify(this.orderId));
                  this.addLineItems();
                  console.log("New Order created");
                });
            });
        },
        error => {
          console.log(error);
        }
      );
    return;
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
                .getOrder(id, this.storedMerchantId, this.storedCloverToken)
                .pipe(first())
                .subscribe(order => {
                  this.cloverOrder = order;
                  console.log(JSON.stringify(this.cloverOrder));
                  if (order.paymentState == "PAID") this.createNewCloverOrder();
                  else this.addLineItems();
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

  addLineItems() {
    console.log("In Line items" + this.orderId);

    const localMerchantId = localStorage.getItem("merchant_id");

    this.cloverApiService
      .GetMerchantId(localMerchantId)
      .pipe(first())
      .subscribe(
        id => {
          this.storedMerchantId = id;

          this.cloverApiService
            .GetCloverToken(this.storedMerchantId)
            .pipe(first())
            .subscribe(token => {
              this.storedCloverToken = token;
              console.log('line Item Is: ' +JSON.stringify(this.lineItems));
              this.lineItems.forEach(lineItem => {
                console.log(JSON.stringify(lineItem));
                this.cloverOrderService
                  .postNewLineItem(
                    this.orderId,
                    lineItem,
                    this.storedMerchantId,
                    this.storedCloverToken
                  )
                  .pipe(first())
                  .subscribe(cloverItem => {
                    lineItem.id = cloverItem.id;
                    console.log(JSON.stringify(lineItem));
                    lineItem.newModifications.forEach(modification => {
                      this.cloverOrderService
                        .postNewModification(
                          this.orderId,
                          lineItem.id,
                          modification,
                          this.storedMerchantId,
                          this.storedCloverToken
                        )
                        .pipe(first())
                        .subscribe(itemModification => {
                          console.log(
                            "modification added:" +
                            JSON.stringify(itemModification)
                          );
                        });
                    });
                    console.log(JSON.stringify(lineItem));
                    this.cartService.removeFromCart(lineItem);
                  });
              });
              this.orderPlaced();
            });
        },
        error => {
          console.log(error);
        }
      );
  }

  orderPlaced() {
    console.log("I'm continuing");
    this.alertService.success("User Created", true);
    //  this.cartService.removeAllFromCart();
    this.loadingButton = false;
    if (this.currentUser.role === "3") {
      this.router.navigate(["/home"]);
    } else if (this.currentUser.role === "1" || this.currentUser.role === "2") {
      this.router.navigate(["/serverOrder"]);
    } else if (this.currentUser.role === "4") {
      this.router.navigate(["/addTip",
        { tableUuid: this.tableUuid,
        tableName: this.tableName,
        categoryUuid: this.categoryUuid}]);
    }
  }

  // This function is to add all the lineItems together but not working right.
  //addNewLineItems() {

  //     console.log("In Line items" + this.orderId);
  // //    this.lineItems.forEach(lineItem => {
  //       console.log(JSON.stringify(this.lineItems));
  //       this.cloverOrderService.postNewLineItems(this.orderId, this.lineItems).pipe(first()).subscribe(cloverItems => {
  //     //    lineItem = cloverItem;
  //     //    console.log(JSON.stringify(lineItem));
  //         this.cartService.removeAllFromCart();
  //         this.orderPlaced();
  //       });

  //     }

  //   submitOrder() {
  //     this.loadingButton = true;
  //     var cloverOrder = new CloverOrder();
  //     // if (this.tableUuid !== 'undefined' && this.tableUuid !== null && this.tableUuid !== undefined) {
  //   //  if (this.orderId != " ")  {
  //     if (false){
  //     //  cloverOrder.employee.id = this.tableUuid;
  //       //var id = " ";
  //       this.orderId = "Z606KETWF5JKW";
  //       cloverOrder = this.findCloverOrder(this.orderId);
  //       // if (this.currentUser.username !== this.currentUser.firstName) {
  //       //   cloverOrder.tableName = this.currentUser.firstName;
  //       // } else {
  //       //   cloverOrder.tableName = this.currentUser.username;
  //       // }
  //     }
  //     else {
  //       cloverOrder.state = "open";
  //       console.log(JSON.stringify(cloverOrder));
  //       cloverOrder = this.createNewCloverOrder(cloverOrder);
  //       this.orderId = cloverOrder.id;
  //     //  cloverOrder.employee.id = this.currentUser.uuid;
  //     //  cloverOrder.tableName = this.currentUser.username;
  //     }
  //     cloverOrder.total = this.cartService.getTotalAmount();
  //  //   cloverOrder.lineItems = this.lineItems;
  //  //   cloverOrder.orderItems = this.items;

  //  //   cloverOrder.orgUuid = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;

  //  this.lineItems.forEach(lineItem => {
  //    this.cloverOrderService.postNewLineItem(cloverOrder.id, lineItem);
  //    this.cartService.removeFromCart(lineItem);
  //  });

  // //  this.cloverOrderService.createItem(cloverOrder).pipe(first())
  // //       .subscribe(
  // //         data => {
  //           this.alertService.success('User Created', true);
  //           this.cartService.removeAllFromCart();
  //           this.loadingButton = false;
  //           if (this.currentUser.role === '3') {
  //             this.router.navigate(['/home']);
  //           } else if (this.currentUser.role === '1' || this.currentUser.role === '2'){
  //             this.router.navigate(['/serverOrder']);
  //           } else if (this.currentUser.role === '4') {
  //             this.router.navigate(['/orderWizard']);
  //           }
  //         // },
  //   //       error => {
  //   //         console.log("ERROR");
  //   //         this.alertService.error(error);
  //   //         this.loadingButton = false;
  //   //       });
  //    }
  // }
}
