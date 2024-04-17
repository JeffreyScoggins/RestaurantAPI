import { Injectable, Component, OnInit } from '@angular/core';
import { first } from "rxjs/operators";
import {ccAuth} from '../_services/ccAuth';
import {CartService} from '../_services/cart.service';
import {ViewCartComponent} from '../view-cart/view-cart.component';
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from 'lodash';
import {User} from '../_models';
import {CloverOrderService} from '../_services/cloverOrder.service';
import {AlertService} from '../_services';
import {CloverApiService} from '../_services/cloverApi.service';
import {CloverOrder} from '../_models/cloverOrder';
import {response} from 'express';
import {NotifierService} from 'angular-notifier';
import * as clover from 'remote-pay-cloud';
import {listenToElementOutputs} from '@angular/core/src/view/element';


@Component({
  selector: "add-tip",
  templateUrl: "./add-tip.component.html",
  styleUrls: ["./add-tip.component.scss"]
})

@Injectable()
export class addTipComponent implements OnInit {

  currentUser: User;
  loading = false;
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


  constructor(
    private cartService: CartService,
    private cloverOrderService: CloverOrderService,
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private cloverApiService: CloverApiService,
    private ccauth: ccAuth,
    private notifier: NotifierService
  ) {
    console.log('Add Tip Constructor');
   }



  ngOnInit() {
    console.log("View Cart Component OnInit ");
    this.activatedRoute.params.subscribe(params => {
      this.tableUuid = params['tableUuid'] ? params['tableUuid'] : this.currentUser.username;
      this.tableName = params['tableName'] ? params['tableName'] : this.currentUser.username;
      this.categoryUuid = params["categoryUuid"];
    });
  }

  submitOrder() {

      if(this.tip == null){
        this.tip = 0;
      }
      this.ccauth.performSale();

      //this.router.navigate(["/orderWizard"]);

    // this.orderPlaced();
  }

  setTotalAmount(total: number){
    this.cart = total;
  }

  getTotalAmount(){
    let total = this.ccauth.getTotal();
    total = total / 100;
    total.toFixed(2);
    return total;

  }


  paymentSuccess(): void{
      this.notifier.notify('success', 'Payment Was Successful');
      this.loadingButton = false;
      this.router.navigate(["/orderWizard"]);
    }

  paymentFailure(){
    this.notifier.notify('error', 'Payment Was Unsuccessful');
    this.loading = false;
    }

  addTip15() {
    this.loading = true;
    this.cart = this.ccauth.getTotal();
    this.tip = (this.cart * .15)
    this.ccauth.setTipAmount(this.tip);
    console.log("Tip Amount: " + this.tip);
    this.submitOrder();
    this.router.navigate(["/orderWizard"]);


  }

  addTip18() {
    this.loading = true;
    this.cart = this.ccauth.getTotal();
    this.tip = (this.cart * .18)
    this.ccauth.setTipAmount(this.tip);
    console.log("Tip Amount: " + this.tip);
    this.submitOrder();
    this.router.navigate(["/orderWizard"]);

  }

  addTip20() {
    this.loading = true;
    this.cart = this.ccauth.getTotal();
    this.tip = (this.cart * .20)
    this.ccauth.setTipAmount(this.tip);
    console.log("Tip Amount: " + this.tip);
    this.submitOrder();
    this.router.navigate(["/orderWizard"]);
  }

  addTip30() {
    this.loading = true;
    this.cart = this.ccauth.getTotal();
    this.tip = (this.cart * .30)
    this.ccauth.setTipAmount(this.tip);
    console.log("Tip Amount: " + this.tip);
    this.submitOrder();
    this.router.navigate(["/orderWizard"]);

  }

  addTipCustom() {
    this.loading = true;
    let customTip;
    customTip = (<HTMLInputElement>document.getElementById("customTip")).value;
      if (customTip > 1000 || customTip < 0) {
        customTip = 0;
      }
    let customTipInt = parseFloat(customTip);
    console.log("Custom Tip Amount: " + customTipInt);
    this.tip = (customTipInt * 100);
    this.ccauth.setTipAmount(this.tip);
    console.log("Tip Amount: " + this.tip);
    this.submitOrder();
    this.router.navigate(["/orderWizard"]);

  }

  addTipNull() {
    this.loading = true;
    this.cart = this.ccauth.getTotal();
    this.ccauth.setTipAmount(0);
    console.log("Tip Amount: " + this.tip);
    this.submitOrder();
    this.router.navigate(["/orderWizard"]);
  }

  getTip15(){
    this.loadingButton = true;
    let tip = (this.getTotalAmount() * .15)
    return this.tip;
  }

  getTip18(){
    let tip = (this.getTotalAmount() * .18)
    return this.tip;
  }

  getTip20(){
    let tip = (this.getTotalAmount() * .20)
    return tip;
  }


  getTip30(){
    let tip = (this.getTotalAmount() * .30)
    return tip;
  }

  public showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

  showTextBox() {
    var x = document.getElementById("customTipBox");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

}
