import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first, map} from 'rxjs/operators';

import {AlertService, AuthenticationService} from '../_services';
import {User} from '../_models';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-logout-page',
  styleUrls: ['logout.component.scss'],
  templateUrl: 'logout.component.html'
})
export class LogoutComponent implements OnInit {
  logoutForm: FormGroup;
  loading = false;
  submitted = false;
  currentUser: User;
  returnUrl: string;
  error = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {
    console.log('in logout.component.ts constructor'); //*MES*
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    console.log('in logout.component.ts OnInit'); //*MES*
    this.logoutForm = this.formBuilder.group({
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.logoutForm.controls;
  }

  onSubmit() {
    this.error = false;
    this.submitted = true;

    // stop here if form is invalid
    if (this.logoutForm.invalid) {
      return;
    }

    this.loading = true;

    // console.log(localStorage.getItem(this.currentUser.username));
    this.authenticationService.login(this.currentUser.username, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.role === '4') {
            this.authenticationService.logout();
            this.router.navigate(['login']);
          }
          // this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = true;
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
