import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { User } from "../_models";
import { Item } from "../_models/Item";
import { CartService } from "../_services/cart.service";
import { MatDialog, MatDialogConfig } from "@angular/material";
import * as uuid from "uuid";
import { ItemOptionsDialogComponentComponent } from "../item-options-dialog-component/item-options-dialog-component.component";
import { NotificationPopupComponent } from "../notification-popup/notification-popup.component";
import { NotifierService } from "angular-notifier";
import { CustomMessageItemDialogComponent } from "../custom-message-item-dialog/custom-message-item-dialog.component";
import { CloverApiService } from "../_services/cloverApi.service";
import { ModifierGroup } from "../_models/modifierGroup";
import { Modifier } from "../_models/modifier";
import { LineItem } from "../_models/lineItem";
import { Modification } from "../_models/modification";
import {Image} from '../_models/image';
import {ImageService} from '../_services/image.service';
import { CdkAccordionItem } from "@angular/cdk/accordion";

@Component({
  selector: "app-items-by-category",
  templateUrl: "./items-by-category.component.html",
  styleUrls: ["./items-by-category.component.scss"]
})
export class ItemsByCategoryComponent implements OnInit {
  currentUser: User;
  items: Item[] = [];
  images: Image[] = [];
  modifierGroups: ModifierGroup[] = [];
  modifiers: Modifier[] = [];
  loading = true;
  tableUuid: string;
  tableName: string;
  categoryUuid: string;
  localMerchantId: string;
  storedMerchantId: any;
  storedCloverToken: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cloverApiService: CloverApiService,
    private cartService: CartService,
    private imageService: ImageService,
    private dialog: MatDialog,
    private notifier: NotifierService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.storedCloverToken = ' ';
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.categoryUuid = params["categoryUuid"];
      this.tableUuid = params["tableUuid"];
      this.tableName = params["tableName"];
      this.loadAllItemsByCategoryUuid(this.categoryUuid);
    });
  }

  private loadAllItemsByCategoryUuid(categoryUuid: string) {
    const localMerchantId = localStorage.getItem('merchant_id');
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
      this.storedMerchantId = id;

      this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
        token => {
        this.storedCloverToken = token;

      this.cloverApiService
      .getAllItemsByCategoryId(categoryUuid, this.storedMerchantId, this.storedCloverToken)
      .pipe(first())
      .subscribe(item => {
        this.items = item.elements;
        console.log("items again for cat" + categoryUuid + " " + this.items);
        this.loadAllItems();
        this.loading = false;
      });
    },
  )},
      error => {
          console.log(error);
      });
}

private loadAllItems() {
  // const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
  // this.itemService.getAll(id).pipe(first()).subscribe(item => {
  //   this.items = item;
  //   this.loading = false;
  // });
  console.log("merchant id: ", this.storedMerchantId);
  this.imageService.getAllItems(this.storedMerchantId).pipe(first()).subscribe(elements => {
    this.images = elements;
    this.matchImages();
  });
}

matchImages() {
  console.log("CloverItems :", this.items.length);
  console.log("images :", this.images.length);
  this.items.forEach(item => {
    this.images.forEach(img => {
      if (img.cloverDataId == item.id)
      {
        item.imageData = img.imageData;
      }
    });
  });
  this.loading = false;
}

  // addToCart(item: Item) {
  //   // if (item.minimumOptionsSelection <= item.selectedOptions.length && item.selectedOptions.length <= item.optionCapacity ) {
  //   const cartItem = this.copyItemtoLineItem(item);

  //  // cartItem.id = uuid.v4();
  //   console.log(cartItem);
  //   // cartItem.imageData = null;
  //   // cartItem.imageName = null;
  //   // cartItem.imageType = null;
  //   this.cartService.addToCart(cartItem);
  //   this.showNotification('success', 'Successfully added to cart.');
  //   // } else {
  //   //   // this.showNotification('error', 'Please click customize and select between ' + item.minimumOptionsSelection + ' and '
  //   //   //    + item.optionCapacity + ' options.');
  //   //   this.openMessageDialog('Please click customize and select between ' + item.minimumOptionsSelection + ' and '
  //   //       + item.optionCapacity + ' options.', 'Selection Error');
  //   // }
  // }

  openOptions(item: Item) {
    // const index = this.items.indexOf(item);

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    console.log("I'm here" + item.id);

    dialogConfig.data = {
      options: item,
      title: "Choose your options"
    };

    const dialogRef = this.dialog.open(
      ItemOptionsDialogComponentComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        //  this.items[index].userData = data.note;
        console.log(data.note);
        this.createLineItems(item, data.selectedOptions, data.note);
      }
    });
  }

  copyItemtoLineItem(item: Item) {
    var cartItem = new LineItem();
    cartItem.cartId = uuid.v4();
    cartItem.name = item.name;
    cartItem.alternateName = item.alternateName;
    //  cartItem.item.id = item.id;
    cartItem.price = item.price;
    return cartItem;
  }

  createLineItems(item: Item, selectedOptions: Modifier[], note: string) {
    var cartItem: LineItem;
    cartItem = this.copyItemtoLineItem(item);

    console.log(JSON.stringify(cartItem));
    cartItem.note = note;
    cartItem.newModifications = [];
    console.log(cartItem);
    if (selectedOptions.length > 0) {
      cartItem.priceWithModifiers = cartItem.price;
      var modifications: Modification[] = [];
      selectedOptions.forEach(element => {
        let modification = new Modification();
        modification.name = element.name;
        modification.amount = element.price;
        cartItem.priceWithModifiers += modification.amount;
        // cartItem.price += modification.amount;
        modification.modifier = element;
        modification.quantitySold = 1;
        modification.refunded = false;
        console.log("modification :" + JSON.stringify(modification));
        modifications.push(modification);
        console.log(JSON.stringify(cartItem));
      });
   //   elements.modifications = modifications;
      // cartItem.modifications = elements;
      cartItem.newModifications = modifications;
    }

    console.log(cartItem);
    this.cartService.addToCart(cartItem);
    this.showNotification('success', 'Successfully added to cart.');
  }

  //
  // openCustomMessage(item: Item) {
  //   const index = this.items.indexOf(item);
  //
  //   const dialogConfig = new MatDialogConfig();
  //
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //
  //   dialogConfig.data = {
  //     title: 'Enter customization message'
  //   };
  //
  //   const dialogRef = this.dialog.open(CustomMessageItemDialogComponent, dialogConfig);
  //
  //   dialogRef.afterClosed().subscribe(
  //     data => {
  //       if (data) {
  //         console.log(data);
  //         this.items[index].selectedOptions[0] = data;
  //         console.log(this.items[index]);
  //         this.cartService.addToCart(this.items[index]);
  //       }
  //     });
  // }

  openMessageDialog(message: string, title: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: message,
      title: title
    };

    const dialogRef = this.dialog.open(
      NotificationPopupComponent,
      dialogConfig
    );
  }

  public showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
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
  public showSpecificNotification(
    type: string,
    message: string,
    id: string
  ): void {
    this.notifier.show({
      id,
      message,
      type
    });
  }

  /**
   * Hide a specific notification (by a given notification ID)
   *
   * @param {string} id Notification ID
   */
  public hideSpecificNotification(id: string): void {
    this.notifier.hide(id);
  }
}
