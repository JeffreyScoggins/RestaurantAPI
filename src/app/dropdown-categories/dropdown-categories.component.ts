import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '../_models';
import {CategoryService} from '../_services/category.service';
import {Category} from '../_models/category';

@Component({
  selector: 'app-dropdown-categories',
  templateUrl: './dropdown-categories.component.html',
  styleUrls: ['./dropdown-categories.component.scss']
})
export class DropdownCategoriesComponent implements OnInit {
  currentUser: User;
  categories: Category[] = [];

  @Input()
  category: Category;

  @Output()
  messageEvent = new EventEmitter<string>();

  constructor(private categoryService: CategoryService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllCategories();
  }

  private loadAllCategories() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.categoryService.getAll(id).pipe(first()).subscribe(category => {
      this.categories = category;
    });
  }

  sendMessage(selected: String) {
    this.messageEvent.emit(selected.toString());
  }
}
