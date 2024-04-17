import {Component, OnInit} from '@angular/core';
import {User} from '../_models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService, UserService} from '../_services';
import {first} from 'rxjs/operators';
import * as uuid from 'uuid';
import {ItemService} from '../_services/item.service';
import {Modifier} from '../_models/modifier';
import {ModifierGroup} from '../_models/modifierGroup';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  currentUser: User;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  modifiers: Modifier[] = [];
  private selectedValue = '';

  modifierGroups: ModifierGroup[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private itemService: ItemService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    const modifier = new Modifier();
    // this.modifiers.push(modifier);
    const modifierGroup = new ModifierGroup();
    modifierGroup.minimumSelect = 0;
    modifierGroup.selected = 0;
    modifierGroup.groupLimit = 10;
    this.modifierGroups.push(modifierGroup);
    // this.modifierGroups[0].modifiers = [];
    // this.modifierGroups[0].modifiers.push(modifier);

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: [0, Validators.required],
      itemUuid: [uuid.v4(), Validators.required],
      categoryUuid: [this.selectedValue, Validators.required],
      // optionCapacity: [1000],
      // minimumOptionsSelection: [0],
      containsOptions: [],
      options: [],
      imageData: [''],
      imageName: [''],
      imageType: ['']
    });
  }

  // convenience getter for easy access to form fields
  public get f() {
    return this.registerForm.controls;
  }

  receiveMessage($event) {
    this.registerForm.controls['categoryUuid'].setValue($event);
  }

  receiveMessageContainsOptions($event) {
    this.registerForm.controls['containsOptions'].setValue(this.booleanConverter($event));
  }

  booleanConverter(stringText: string) {
    if (stringText === 'true') {
      return true;
    } else {
      return false;
    }
  }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;

    // if (this.registerForm.get('optionCapacity').value === null || this.registerForm.get('optionCapacity').value === undefined ) {
    //   this.registerForm.controls['optionCapacity'].setValue(1000);
    // }

    if (this.registerForm.get('containsOptions').value === true) {
      // const search: string = (<HTMLInputElement>document.getElementById('options')).value.toString();
      // const options = search.split(',');
      // this.registerForm.controls['options'].setValue(this.modifiers);
      this.registerForm.controls['options'].setValue(this.modifierGroups);

    }

    const files = (<HTMLInputElement>document.getElementById('myFile')).files[0];
    const url = (<HTMLInputElement>document.getElementById('image-url')).value;

    if (files) {
      const x = await this.getBase64(files).then((data) => this.registerForm.controls['imageData'].setValue(data.toString()));
      console.log(x);
      // this.registerForm.controls['imageName'].setValue(files.name);
      // this.registerForm.controls['imageType'].setValue(files.type);
    }

    if (url.length > 3) {
      this.registerForm.controls['imageData'].setValue(url);
    }

    this.registerForm.addControl('orgUuid', new FormControl(this.currentUser._id, Validators.required));

    this.itemService.createItem(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Item Created', true);
          this.router.navigate(['/itemList']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  // addModifier() {
  //   const modifier = new Modifier();
  //   this.modifiers.push(modifier);
  // }

  addModifierGroup() {
    const modifier = new Modifier();
    const modifierGroup = new ModifierGroup();
    modifierGroup.minimumSelect = 0;
    modifierGroup.selected = 0;
    modifierGroup.groupLimit = 10;
    this.modifierGroups.push(modifierGroup);
    this.modifierGroups[this.modifierGroups.length - 1].modifiers.elements = [];
    this.modifierGroups[this.modifierGroups.length - 1].modifiers.elements.push(modifier);
  }

  deleteModifierGroup(index: number) {
    this.modifierGroups.splice(index, 1);
  }

  addModifiersToGroups(index: number) {
    const modifier = new Modifier();
    this.modifierGroups[index].modifiers.elements.push(modifier);
  }


  async getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = err => reject(err);
    });
  }

  deleteModifier(groupIndex: number, modifierIndex: number) {
    this.modifierGroups[groupIndex].modifiers.elements.splice(modifierIndex, 1);
  }

  // onModifierChange(index: number, type: string) {
  //   if (type === 'name') {
  //     const search: string = (<HTMLInputElement>document.getElementById('modifierName-' + index)).value.toString();
  //     this.modifiers[index].name = search;
  //   } else if (type === 'price') {
  //     const search1 = Number((<HTMLInputElement>document.getElementById('modifierPrice-' + index)).value);
  //     this.modifiers[index].price = search1;
  //   }
  // }

}

