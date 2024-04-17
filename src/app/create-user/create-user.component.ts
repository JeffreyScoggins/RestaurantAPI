import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AlertService, UserService} from '../_services';
import * as uuid from 'uuid';
import {User} from '../_models';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  currentUser: User;
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imageData: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const files = (<HTMLInputElement>document.getElementById('myFile')).files[0];

    if (files) {
      await this.getBase64(files).then((data) => this.registerForm.controls['imageData'].setValue(data.toString()));
    }

    this.loading = true;
    const table = new User();
    Object.assign(table, this.createTable(this.registerForm));
    table.orgUuid = this.currentUser._id;

    this.userService.createUser(table, this.currentUser)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('User Created', true);
          this.router.navigate(['/userAccounts']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  createTable(form: FormGroup) {
    const table = new User();
    table.firstName = form.controls['firstName'].value;
    table.lastName = form.controls['lastName'].value;
    table.username = form.controls['username'].value;
    table.password = form.controls['password'].value;
    table.orgUuid = this.currentUser._id;
    table.imageData = form.controls['imageData'].value;
    table.uuid = uuid.v4();
    return table;
  }

  async getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
    });
  }


}
