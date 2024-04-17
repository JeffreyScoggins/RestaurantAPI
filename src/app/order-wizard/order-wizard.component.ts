import {Component, OnInit} from '@angular/core';
import {OrderService} from '../_services/order.service';
import {User} from '../_models';
import {Router} from '@angular/router';
import Pusher from 'pusher-js';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {NotificationPopupComponent} from '../notification-popup/notification-popup.component';
import {ServerRequest} from '../_models/serverRequest';
import {ServerRequestService} from '../_services/serverRequest.service';
import {NotifierService} from 'angular-notifier';
import {ClientCredentials} from '../_models/clientCredentials';
import {CloverApiService} from '../_services/cloverApi.service';
import {CloverAuthenticationService} from '../_services/cloverAuthentication.service';
import {first} from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-order-wizard',
  templateUrl: './order-wizard.component.html',
  styleUrls: ['./order-wizard.component.scss']
})
export class OrderWizardComponent implements OnInit {
  estimatedTime: string;
  currentUser: User;
  serverButtonDisabled = false;
  merchant_id: string;
  client_id: string;
  code: string;

  constructor(private orderService: OrderService, private router: Router, private dialog: MatDialog, private serverRequestService: ServerRequestService,
              private notifier: NotifierService, private cloverApiService: CloverApiService, private cloverTokenService: CloverAuthenticationService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("OrderWizard Constuctor: ", this.currentUser);
    const pusher = new Pusher('0fce1d9fc729dc6facf5', {
      cluster: 'mt1',
      forceTLS: true,
      contentType: JSON
    });

    const channel = pusher.subscribe('order-channel');
    channel.bind('new-order', data => {
      if (data.added === true && data.orgUuid === this.currentUser.orgUuid) {
        const eta = Number(this.estimatedTime) + 4;
        this.estimatedTime = eta.toString();
      } else if (data.added === false && data.orgUuid === this.currentUser.orgUuid) {
        const eta = Number(this.estimatedTime) - 4;
        //this.estimatedTime = eta.toString();
      }
    });
  }

  ngOnInit() {
    this.loadEstimatedTime();
    console.log('Estimated Time: ' + this.estimatedTime);
  }

  loadEstimatedTime() {
    this.orderService.getOrderTime(this.currentUser.orgUuid).subscribe( time => {
      this.estimatedTime = time.toString();
    });

  }

  startOrder() {
    const x = (<HTMLInputElement>document.getElementById('name')).value;
    if (x.length >= 3) {
      const newUser: User = JSON.parse(localStorage.getItem('currentUser'));
      newUser.uuid = x;
      newUser.firstName = x;
      newUser.lastName = x;
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      console.log("OrderWizard StartOrder :", this.currentUser);
      console.log("OrderWizard localstorage :", localStorage.getItem('currentUser'));
      // return this.router.navigate(['/order', {tableUuid: this.currentUser.firstName, tableName: this.currentUser.lastName}]);
      if (localStorage.getItem('clover_access_token') !== null && this.getCookie('clover_access_token_cookie') === true) {
        return this.router.navigate(['/order', {tableUuid: x, tableName: x}]);
      }
      else {
        window.location.assign('https://sandbox.dev.clover.com/oauth/authorize?client_id=7HPEPVBTZGDCP'); //sends user to clover to login to reauthenticate token
      }
    } else {
      this.openMessageDialog('Please enter a name with atleast 3 characters', 'Error Name Required');
    }
  }

  openMessageDialog(message: string, title: string) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: message,
      title: title
    };

    const dialogRef = this.dialog.open(NotificationPopupComponent, dialogConfig);
  }

  logOut() {

    console.log('in sidebar menu - logout '+ this.currentUser); //*MES*
    console.log('in sidebar menu - logout '+ this.currentUser); //*MES*
    localStorage.setItem('currentUser', null);
    localStorage.setItem('currentUser', null);
    localStorage.setItem('orderId', null);
    localStorage.setItem('orderId', null);
    this.router.navigate(['login']);
    this.router.navigate(['login']);
  }

  callServer() {

    console.log('in sidebar menu - logout '+ this.currentUser); //*MES*
              localStorage.setItem('currentUser', null);
              localStorage.setItem('orderId', null);
              this.router.navigate(['login']);

    if (!this.serverButtonDisabled) {
      this.serverButtonDisabled = true;
      const serverRequest = new ServerRequest();
      serverRequest.messageData = 'Table ' + this.currentUser.username.toString() + ' has requested a waiter';
      serverRequest.orgUuid = this.currentUser.orgUuid;
      console.log("Order Wizard - call Server :", serverRequest.messageData, serverRequest.orgUuid);
      this.serverRequestService.createOrder(serverRequest).subscribe(() => {
        this.showNotification('success', 'Waiter Successfully Requested');
        setTimeout(() => {
          this.serverButtonDisabled = false;
        }, 30000);
      }


      );
    } else {
      this.showNotification('error', 'Please wait 5 min before requesting server again.');
    }
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1 , c.length);
      if (c.indexOf(nameEQ) === 0) {
        return true;
      }
    }
    return false;
  }
}
