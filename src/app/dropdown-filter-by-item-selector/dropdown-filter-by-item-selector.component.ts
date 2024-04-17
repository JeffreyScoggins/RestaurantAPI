import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../_models';
import {Item} from '../_models/Item';
import {CategoryService} from '../_services/category.service';
import {ItemService} from '../_services/item.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-dropdown-filter-by-item-selector',
  templateUrl: './dropdown-filter-by-item-selector.component.html',
  styleUrls: ['./dropdown-filter-by-item-selector.component.scss']
})
export class DropdownFilterByItemSelectorComponent implements OnInit {

  currentUser: User;
  items: Item[] = [];

  @Input()
  typeDropdown: string;

  @Output()
  messageEvent = new EventEmitter<string>();

  constructor(private categoryService: CategoryService, private itemService: ItemService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllItem();
  }

  private loadAllItem() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.itemService.getAll(id).pipe(first()).subscribe(item => {
      this.items = item;
    });
  }

  sendMessage(selected: String) {
    this.messageEvent.emit(selected.toString());
  }
}

