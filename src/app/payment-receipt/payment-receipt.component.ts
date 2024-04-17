import { Injectable, Component, OnInit } from '@angular/core';
import { first } from "rxjs/operators";
import { NotifierService } from "angular-notifier";
import {CartService} from '../_services/cart.service';
import {ViewCartComponent} from '../view-cart/view-cart.component';
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from 'lodash';
import {User} from '../_models';
import {ItemsPageComponent} from '../items-page/items-page.component';
import {addTipComponent} from '../add-tip/add-tip.component';
import {CloverOrderService} from '../_services/cloverOrder.service';
import {AlertService} from '../_services';
import {CloverApiService} from '../_services/cloverApi.service';
import {CloverOrder} from '../_models/cloverOrder';
import {response} from 'express';
import * as clover from 'remote-pay-cloud';



@Component({
  selector: "payment-receipt",
  templateUrl: "./payment-receipt.component.html",
  styleUrls: ["./payment-receipt.component.scss"]
})

@Injectable()
export class paymentReceiptComponent implements OnInit {
  currentUser: User;
  loading = true;
  loadingButton = false;
  tableUuid: string;
  tableName: string;
  categoryUuid: string;
  cloverOrder: CloverOrder;
  orderId: string;
  orderNew = true;
  total: number;
  localMerchantId: string;
  storedMerchantId: string;
  storedCloverToken: string;
  cart: number;
  tip: number;
  customTip: number;
  notifier: NotifierService;
  router: Router;
  alertService: AlertService;
  activatedRoute: ActivatedRoute;

  constructor(
    notifier: NotifierService,
    router: Router,
  )

  {
    console.log('Payment Receipt Constructor');
    this.notifier = notifier;
    this.router = router;
  }


  ngOnInit() {
    console.log("Payment Receipt OnInit ");
    //this.activatedRoute.params.subscribe(params => {
      // this.tableUuid = params['tableUuid'] ? params['tableUuid'] : this.currentUser.username;
      // this.tableName = params['tableName'] ? params['tableName'] : this.currentUser.username;
      // this.categoryUuid = params["categoryUuid"];
   //});


  }

  paymentSuccess(): void{
    this.showNotification('success', 'Payment Was Successful');
    this.loadingButton = false;
    this.router.navigate(["/orderWizard"]);

  }

  paymentFailure(): void{
    this.showNotification('error', 'Payment Was Unsuccessful');
    this.loadingButton = false;
    this.router.navigate(["/addTip"]);
  }

  public showNotification = (type: string, message: string): void  => {
    this.notifier.notify(type, message);
  }
}
