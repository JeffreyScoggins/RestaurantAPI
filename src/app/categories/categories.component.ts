import {Component, OnInit} from '@angular/core';
import {User} from '../_models';
import {Category} from '../_models/category';
import {CategoryService} from '../_services/category.service';
import {first} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import { CloverCategories } from '../_models/cloverCategories';
import { CloverApiService } from '../_services/cloverApi.service';
import {Image} from '../_models/image';
import {ImageService} from '../_services/image.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { UploadImageDialogComponent } from '../upload-image-dialog/upload-image-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  currentUser: User;
  images: Image[] = [];
  loading = true;
  loadingButton = false;

  storedMerchantId: string;
  storedCloverToken: string;
  cloverCategories: CloverCategories[] = [];

  constructor( private notifier: NotifierService,
    private dialog: MatDialog,
    private imageService: ImageService,
    private cloverApiService: CloverApiService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("Categories.component.ts currentUser :", this.currentUser);
  }

  ngOnInit() {
    this.loadCloverCategories();
  }

  private loadCloverCategories() {
    console.log('Categories component - loadCloverCategories');

    const localMerchantId = localStorage.getItem('merchant_id');
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
        this.storedMerchantId = id;

        this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
          token => {
            this.storedCloverToken = token;

            this.cloverApiService.getAllCategories(this.storedMerchantId, this.storedCloverToken).subscribe(category => {
              this.cloverCategories = category.elements;
              this.loadAllCategories();
              // this.loading = false;
            });
          },
        )
      },
      error => {
        console.log(error);
      });
  }

  updateImage(category: CloverCategories) {
    this.loadingButton = true;
    // this.categoryService.delete(id).pipe(first()).subscribe(() => {
    //   this.loadAllCategories();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    console.log("Update Category :" + category.name);

    dialogConfig.data = {
      name: category.name,
      id: category.id,
      isCategory: true,
      title: "Add/Modify Image"
    };

    const dialogRef = this.dialog.open(
      UploadImageDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        //  this.items[index].userData = data.note;
        category.imageData = data.returnImage;
        // console.log(data.returnImage);
     //   this.createLineItems(item, data.selectedOptions, data.note);
      }
    });
   //   this.showNotification('success', 'Image updated.');
      this.loadingButton = false;
   // });
  }
  
  private loadAllCategories() {
    console.log("in load all categories");
    this.imageService.getAllCategories(this.storedMerchantId).pipe(first()).subscribe(elements => {
      this.images = elements;
      this.matchImages();
    });
  }

  matchImages() {
    console.log("CloverCategories :", this.cloverCategories);
    console.log("images :", this.images);
    this.cloverCategories.forEach(cloverCategory => {
      this.images.forEach(img => {
        if (img.cloverDataId == cloverCategory.id)
        {
          cloverCategory.imageData = img.imageData;
        }
      });
    });
    this.loading = false;
  }

  deleteCategory(id: string) {

    this.loadingButton = true;
    this.imageService.delete(id).pipe(first()).subscribe(() => {
        this.loadAllCategories();
        this.showNotification('success', 'Category successfully deleted.');
        this.loadingButton = false;
      });
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

}