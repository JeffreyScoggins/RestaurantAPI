import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { first } from 'rxjs/operators';
import { ImageService } from '../_services/image.service';
import { AlertService, UserService } from '../_services';
import { User } from '../_models';
import { Image } from '../_models/image';

@Component({
  selector: 'app-upload-image-dialog',
  templateUrl: './upload-image-dialog.component.html',
  styleUrls: ['./upload-image-dialog.component.scss']
})

export class UploadImageDialogComponent implements OnInit {

  currentUser: User;
  imageForm: FormGroup;
  submitted = false;
  selectionError = false;
  localMerchantId: any;
  storedMerchantId: string;
  storedCloverToken: any;
  dataType: string;
  errorMsg: string = "";
  image: Image;
   resizebase64 = require('resize-base64');

  constructor(
    private dialogRef: MatDialogRef<UploadImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private imageService: ImageService,
    private alertService: AlertService)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("Upload image constructor :", data.name);
    this.image = new Image();
    this.image.merchantId = localStorage.getItem('merchant_id');
    this.image.isCategory = data.isCategory;
    this.image.cloverDataName = data.name;
    this.image.cloverDataId = data.id;
    this.selectionError = false;
  }

  ngOnInit() {
   this.dataType = this.image.isCategory ? 'Category' : 'Item';
  }

  async save() {
    this.submitted = true;
    this.selectionError = false;
    this.errorMsg = "";

    const files = (<HTMLInputElement>document.getElementById('myFile')).files[0];
    const url = (<HTMLInputElement>document.getElementById('image-url')).value;

    if (files == null && url.length < 3) {
      //    this.alertService.error("No image file selected. Click Cancel to exit");
      this.selectionError = true;
      this.errorMsg = "Image not selected";
      return;
    }

    if (files) {
      const x = await this.getBase64(files).then((data) =>this.image.imageData = this.resizebase64(data,200,200).toString());
    }
    else  {
      this.image.imageData = url;
    }

    // if (this.image.imageData.match(/image\/*/) == null) {
    //   console.log( "Only images are supported.");
    //   this.errorMsg = "Please check the image link";
    //   this.selectionError = true;
    //   return;
    // }
    console.log("Image :", this.image);
    this.imageService.updateImage(this.image)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Image Uploaded', true);
        },
        error => {
          this.alertService.error(error);
        });

    this.dialogRef.close({
      returnImage: this.image.imageData
    });
  }

  // public get f() {
  //   return this.imageForm.controls;
  // }

  async getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
    });
  }

  async delete() {
    this.submitted = true;
    this.selectionError = false;

    this.image.imageData = "";
    this.imageService.updateImage(this.image)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Image Deleted', true);
        },
        error => {
          this.alertService.error(error);
        });

    this.dialogRef.close({
      image: this.image.imageData
    });

  }

  close() {
    this.dialogRef.close();
  }

}
