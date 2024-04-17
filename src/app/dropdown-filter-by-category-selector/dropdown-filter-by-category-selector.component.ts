import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../_models';
import {Category} from '../_models/category';
import {CategoryService} from '../_services/category.service';
import {ItemService} from '../_services/item.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-dropdown-filter-by-category-selector',
  templateUrl: './dropdown-filter-by-category-selector.component.html',
  styleUrls: ['./dropdown-filter-by-category-selector.component.scss']
})
export class DropdownFilterByCategorySelectorComponent implements OnInit {

  currentUser: User;
  categories: Category[] = [];

  @Input()
  typeDropdown: string;

  @Output()
  messageEvent = new EventEmitter<string>();

  constructor(private categoryService: CategoryService, private itemService: ItemService) {
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
