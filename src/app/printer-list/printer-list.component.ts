import {ccAuth} from '../_services/ccAuth';
import * as _ from 'lodash';
import {User} from '../_models';
import {CloverApiService} from '../_services/cloverApi.service';
import {NotifierService} from 'angular-notifier';
import * as clover from 'remote-pay-cloud';
import {Component, OnInit} from '@angular/core';
import {Item} from '../_models/Item';
import {ActivatedRoute} from '@angular/router';
import {ItemService} from '../_services/item.service';
import {CartService} from '../_services/cart.service';
import {first} from 'rxjs/operators';
import {Image} from '../_models/image';
import {ImageService} from '../_services/image.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { UploadImageDialogComponent } from '../upload-image-dialog/upload-image-dialog.component';



@Component({
  selector: 'printer-list',
  templateUrl: './printer-list.component.html',
  styleUrls: ['./printer-list.component.scss']
})

export class printerListComponent implements OnInit {
  currentUser: User;
  loading = true;
  loadingButton = false;



  constructor(private notifier: NotifierService,
              private itemService: ItemService,
              private dialog: MatDialog,
              private imageService: ImageService,
              private cloverApiService: CloverApiService,
              private ccauth: ccAuth
  ) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log("print-list.component.ts currentUser :", this.currentUser);
  }

  ngOnInit() {
  this.getPrinters();
  console.log('PrintList');
  }

  getPrinters() {
    var xml = new XMLHttpRequest();
    var url = "https://sandbox.dev.clover.com/v3/merchants/" + localStorage.getItem('merchant_id') + "/printers?access_token=" + localStorage.getItem('clover_access_token');
    console.log(url)
    xml.open("GET", url, true);
    xml.send();
    xml.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var parse = xml.responseXML.getElementsByName('elements');
        return parse
      }
    }
  }

  onPrinterSelect(printer: string) {

  }
}
