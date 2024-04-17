import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '../_models';
import {Category} from '../_models/category';
import {CategoryService} from '../_services/category.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ServerRequestService} from '../_services/serverRequest.service';
import {ServerRequest} from '../_models/serverRequest';
import {NotifierService} from 'angular-notifier';
import {CloverCategories} from '../_models/cloverCategories';
import {Item} from '../_models/Item';
import {CloverApiService} from '../_services/cloverApi.service';
import {CloverAuthenticationService} from '../_services/cloverAuthentication.service';
import {ClientCredentials} from '../_models/clientCredentials';
import {Image} from '../_models/image';
import {ImageService} from '../_services/image.service';
import * as _ from 'lodash';
import { pipe } from 'rxjs';
//import {environment} from '../../environments/environment';
import {environment} from '../../environments/environment.prod';


@Component({
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  currentUser: User;
  // categories: Category[] = [];
  images: Image[] = [];
  loading = true;
  tableUuid: string;
  serverButtonDisabled = false;
  tableName: string;
  url_merchant_id: string;
  localMerchantId: any;
  storedMerchantId: string;
  storedCloverToken: string;
  categoriesFirstMerchants: string[];
  categoriesFirstSwitch: boolean;
  cloverCategories: CloverCategories[] = [];
  cloverItems: Item[] = [];
  url_client_id: string;
  url_code: string;

  constructor(private categoryService: CategoryService, private activatedRoute: ActivatedRoute,
              private serverRequestService: ServerRequestService,
              private imageService: ImageService,
              private router: Router,
              private notifier: NotifierService, private cloverTokenService: CloverAuthenticationService,
              private cloverApiService: CloverApiService) {
    console.log('Home component - constructor : ', activatedRoute.params);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.activatedRoute.params.subscribe(params => {
      console.log('Home component - Router params : ', params.tableName, params.tableUuid);
      this.tableUuid = params['tableUuid'] ? params['tableUuid']: this.currentUser.username;
      this.tableName = params['tableName'] ? params['tableName']: this.currentUser.username;
    });
    this.categoriesFirstMerchants = ['invalid id'];
    this.categoriesFirstSwitch = true;
    this.initialRouterPropertiesSet();
    }

  ngOnInit() {
    console.log('In home component - onInit merchant:');
    if ((this.currentUser.role === '1' || this.currentUser.role === '2')
      && (this.tableName === this.currentUser.username))
      {
        this.router.navigate(['/serverOrder']);
      }
    else

      if (this.categoriesFirstSwitch)
        this.loadCloverCategories();
      else
        this.loadCloverItems();
  }

  private loadCloverCategories() {
    console.log('In home component - loadCloverCategories');

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
      this.loading = false;
        });
      },
    )},
      error => {
          console.log(error);
      });
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

  private loadCloverItems() {
    console.log('In home component - loadCloverItems');

    const localMerchantId = localStorage.getItem('merchant_id');
    this.cloverApiService.GetMerchantId(localMerchantId).pipe(first()).subscribe(
      id => {
      this.storedMerchantId = id;

      this.cloverApiService.GetCloverToken(this.storedMerchantId).pipe(first()).subscribe(
        token => {
        this.storedCloverToken = token;

      this.cloverApiService.getAllItems(this.storedMerchantId, this.storedCloverToken).pipe(first()).subscribe(
        item => {
        this.cloverItems = item.elements;
        this.loading = false;
        });
      },
    )},
      error => {
          console.log(error);
      });
}

  callServer() {
    if (!this.serverButtonDisabled) {
      this.serverButtonDisabled = true;
      const serverRequest = new ServerRequest();
      serverRequest.messageData = 'Table ' + this.currentUser.username.toString() + ' has requested a waiter';
      serverRequest.orgUuid = this.currentUser.orgUuid;
      console.log("Home - call Server :", serverRequest.messageData, serverRequest.orgUuid);
      this.serverRequestService.createOrder(serverRequest).subscribe(() => {
        this.showNotification('success', 'Waiter Successfully Requested');
        setTimeout(() => {
          this.serverButtonDisabled = false;
        }, 30000);
      });
    } else {
      this.showNotification('error', 'Please wait 5 min before requesting server again.');
    }
  }

  initialRouterPropertiesSet() {
    console.log('In home component - initialRouterPropertiesSet'); //*MES*

    const url_string = window.location.href;
    const url = new URL(url_string);

    const credentials = new ClientCredentials();

    this.url_merchant_id = url.searchParams.get('merchant_id');
    this.url_client_id = url.searchParams.get('client_id');
    this.url_code = url.searchParams.get('code');


    credentials.merchantId = this.url_merchant_id;
    credentials.clientId = this.url_client_id;

    this.cloverTokenService.login(this.url_merchant_id, this.url_client_id, this.url_code).pipe(first())
      .subscribe(
        data => {
          credentials.cloverToken = data.access_token;
          console.log(" successful login : " + credentials.cloverToken);
          this.cloverApiService.SaveClientCredentials(credentials).pipe(first()).subscribe(
            success => {

            }
          );
        },
        error => {
          console.log(error);
        });

    if (!_.isNil(this.url_merchant_id)) {
      localStorage.setItem('merchant_id', this.url_merchant_id);
    }

    if (!this.categoriesFirstMerchants.includes(localStorage.getItem('merchant_id')))
      this.categoriesFirstSwitch = true;
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }
}
