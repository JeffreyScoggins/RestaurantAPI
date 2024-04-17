import {Component, OnInit} from '@angular/core';
import {User} from '../_models';
import {Item} from '../_models/Item';
import {ActivatedRoute} from '@angular/router';
import {ItemService} from '../_services/item.service';
import {CartService} from '../_services/cart.service';
import {first} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import { CloverApiService } from '../_services/cloverApi.service';
import {Image} from '../_models/image';
import {ImageService} from '../_services/image.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { UploadImageDialogComponent } from '../upload-image-dialog/upload-image-dialog.component';

@Component({
  selector: 'app-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss']
})
export class ItemsPageComponent implements OnInit {
  currentUser: User;
  items: Item[] = [];
  loading = true;
  loadingButton = false;

  images: Image[] = [];
  storedMerchantId: string;
  storedCloverToken: string;

  constructor(private notifier: NotifierService,
              private itemService: ItemService,
              private dialog: MatDialog,
    private imageService: ImageService,
    private cloverApiService: CloverApiService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("Items-page.component.ts currentUser :", this.currentUser);
  }

  ngOnInit() {
    this.loadCloverItems();
    // this.loadAllItems();
  }

  private loadCloverItems() {
    console.log('Items-page component - loadCloverItems');
    const localMerchantId = localStorage.getItem('merchant_id');
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
      this.storedMerchantId = id;

      this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
        token => {
        this.storedCloverToken = token;

      this.cloverApiService
      .getAllItems(this.storedMerchantId, this.storedCloverToken)
      .pipe(first())
      .subscribe(items => {
        this.items = items.elements;
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


  updateImage(item: Item) {
    this.loadingButton = true;
    // this.categoryService.delete(id).pipe(first()).subscribe(() => {
    //   this.loadAllCategories();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    console.log("Update Item :" + item.name);

    dialogConfig.data = {
      name: item.name,
      id: item.id,
      isCategory: false,
      title: "Add/Modify Image"
    };

    const dialogRef = this.dialog.open(
      UploadImageDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        //  this.items[index].userData = data.note;
        item.imageData = data.returnImage;
        // console.log(data.returnImage);
     //   this.createLineItems(item, data.selectedOptions, data.note);
      }
    });
   //   this.showNotification('success', 'Image updated.');
      this.loadingButton = false;
   // });
  }

  deleteItem(id: string) {
    this.loadingButton = true;
    this.itemService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllItems();
      this.showNotification('success', 'Item successfully deleted.');
      this.loadingButton = false;
    });
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

}
