import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/operators';
import {User} from '../_models';
import {Item} from '../_models/Item';
import {CartService} from '../_services/cart.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import * as uuid from 'uuid';
import {ItemOptionsDialogComponentComponent} from '../item-options-dialog-component/item-options-dialog-component.component';
import {NotificationPopupComponent} from '../notification-popup/notification-popup.component';
import {NotifierService} from 'angular-notifier';
import {CustomMessageItemDialogComponent} from '../custom-message-item-dialog/custom-message-item-dialog.component';
import {CloverApiService} from '../_services/cloverApi.service';
import { CloverCategories } from '../_models/cloverCategories';
import { LineItem } from '../_models/lineItem';
import { ClientCredentials } from '../_models/clientCredentials';

@Component({
  selector: 'app-categories-by-item',
  templateUrl: './categories-by-item.component.html',
  styleUrls: ['./categories-by-item.component.scss']
})

export class CategoriesByItemComponent implements OnInit {

  currentUser: User;
  cloverCategories: CloverCategories[] = [];
  credentials: ClientCredentials;
  item: Item;
  loading = true;
  tableUuid: string;
  tableName: string;
  itemUuid: string;
  localMerchantId: string;
  storedMerchantId: any;
  storedCloverToken: any;

  constructor(private activatedRoute: ActivatedRoute,
              private cloverApiService: CloverApiService,
              private cartService: CartService,
              private dialog: MatDialog,
              private notifier: NotifierService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.itemUuid = params['itemUuid'];
      this.tableUuid = params['tableUuid'];
      this.tableName = params['tableName'];
      this.loadAllCategoriesByItemUuid(this.itemUuid);
    });
  }

  private loadAllCategoriesByItemUuid(itemUuid: string) {
    const localMerchantId = localStorage.getItem('merchant_id');

    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
      this.storedMerchantId = id;

      this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
        token => {
        this.storedCloverToken = token;

      this.cloverApiService.getAllCategoriesByItemId(itemUuid, this.storedMerchantId, this.storedCloverToken).subscribe(cloverCategory => {
        this.cloverCategories = cloverCategory.elements;
        this.loading = false;
  
        this.cloverApiService.getItemByItemId(itemUuid, this.storedMerchantId, this.storedCloverToken).subscribe(cloverItem => {
          this.item = cloverItem;
          this.loading = false;
        });
    });
  });
},
      error => {
          console.log(error);
      });
  }


  addToCart(item: Item) {
    // if (item.minimumOptionsSelection <= item.selectedOptions.length && item.selectedOptions.length <= item.optionCapacity ) {
    const cartItem = new LineItem();
    Object.assign(cartItem, item);
    cartItem.id = uuid.v4();
    // cartItem.imageData = null;
    // cartItem.imageName = null;
    // cartItem.imageType = null;
    this.cartService.addToCart(cartItem);
    this.showNotification('success', 'Successfully added to cart.');
    // } else {
    //   // this.showNotification('error', 'Please click customize and select between ' + item.minimumOptionsSelection + ' and '
    //   //    + item.optionCapacity + ' options.');
    //   this.openMessageDialog('Please click customize and select between ' + item.minimumOptionsSelection + ' and '
    //       + item.optionCapacity + ' options.', 'Selection Error');
    // }
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

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  /**
   * Hide oldest notification
   */
  public hideOldestNotification(): void {
    this.notifier.hideOldest();
  }

  /**
   * Hide newest notification
   */
  public hideNewestNotification(): void {
    this.notifier.hideNewest();
  }

  /**
   * Hide all notifications at once
   */
  public hideAllNotifications(): void {
    this.notifier.hideAll();
  }

  /**
   * Show a specific notification (with a custom notification ID)
   *
   * @param {string} type    Notification type
   * @param {string} message Notification message
   * @param {string} id      Notification ID
   */
  public showSpecificNotification( type: string, message: string, id: string ): void {
    this.notifier.show( {
      id,
      message,
      type
    } );
  }

  /**
   * Hide a specific notification (by a given notification ID)
   *
   * @param {string} id Notification ID
   */
  public hideSpecificNotification( id: string ): void {
    this.notifier.hide( id );
  }
}
