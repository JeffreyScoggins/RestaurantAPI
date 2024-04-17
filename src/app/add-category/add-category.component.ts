import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService, UserService} from '../_services';
import {first} from 'rxjs/operators';
import {User} from '../_models';
import * as uuid from 'uuid';
import {CategoryService} from '../_services/category.service';


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  currentUser: User;
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private categoryService: CategoryService,
              private alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      categoryName: ['', Validators.required],
      categoryUuid: [uuid.v4(), Validators.required],
      imageData: [''],
      imageName: [''],
      imageType: ['']
    });
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const files = (<HTMLInputElement>document.getElementById('myFile')).files[0];
    const url = (<HTMLInputElement>document.getElementById('image-url')).value;

    if (files) {
      const x = await this.getBase64(files).then((data) => this.registerForm.controls['imageData'].setValue(data.toString()));
      // this.registerForm.controls['imageName'].setValue(files.name);
      // this.registerForm.controls['imageType'].setValue(files.type);
    }

    if (url.length > 3) {
      this.registerForm.controls['imageData'].setValue(url);
    }

    this.registerForm.addControl('orgUuid', new FormControl(this.currentUser._id, Validators.required));

    this.categoryService.createCategory(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Category Created', true);
          this.router.navigate(['/categories']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  public get f() {
    return this.registerForm.controls;
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
