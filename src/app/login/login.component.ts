import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService} from '../_services';
import {User} from '../_models';
import {Image} from '../_models/image';
import {CloverCategories} from '../_models/cloverCategories';
import {Item} from '../_models/Item';
import {ClientCredentials} from '../_models/clientCredentials';
import {CategoryService} from '../_services/category.service';
import {ServerRequestService} from '../_services/serverRequest.service';
import {ServerRequest} from '../_models/serverRequest';
import {NotifierService} from 'angular-notifier';

import {CloverApiService} from '../_services/cloverApi.service';
import {CloverAuthenticationService} from '../_services/cloverAuthentication.service';

import {ImageService} from '../_services/image.service';
import * as _ from 'lodash';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login-page',
  styleUrls: ['login.component.scss'],
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = false;
  currentUser: User;
  // categories: Category[] = [];
  images: Image[] = [];
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

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private cloverTokenService: CloverAuthenticationService,
    private alertService: AlertService,
    private cloverApiService: CloverApiService)
  {
    console.log('in login.component.ts constructor', activatedRoute.params); //*MES*
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.categoriesFirstMerchants = ['invalid id'];
    this.categoriesFirstSwitch = true;

  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      this.url_merchant_id = params['merchant_id'];
      this.url_client_id = params['client_id'];
      this.url_code = params['code'];

    });
    console.log('in login.component.ts OnInit'); //*MES*
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('in login.component.ts OnInit completed'); //*MES*
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    console.log('in login.component.ts OnSubmit'); //*MES*
    this.error = false;
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.role !== '4') {
            if (localStorage.getItem('clover_access_token') !== null && this.getCookie('clover_access_token_cookie') === true) {
              return this.router.navigate(['/home']);
            }
            else {
              window.location.assign('https://sandbox.dev.clover.com/oauth/authorize?client_id=7HPEPVBTZGDCP');
            }
          } else if (data.role === '4') {
            this.router.navigate(['/orderWizard']);
          }
          // this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = true;
          this.alertService.error(error);
          this.loading = false;
        });
    console.log('in login.component.ts OnSubmit completed'); //*MES* - doesnt reach here mostly.
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
