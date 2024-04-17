import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dropdown-item-option-selector',
  templateUrl: './dropdown-item-option-selector.component.html',
  styleUrls: ['./dropdown-item-option-selector.component.scss']
})
export class DropdownItemOptionSelectorComponent implements OnInit {

  // @Input()
  // limitSelection: boolean;

  @Input()
  options: string[];

  @Input()
  limitSelection: number;

  @Output()
  selectedList = new EventEmitter<string[]>();

  myForm: FormGroup;
  disabled = false;
  ShowFilter = true;

  selectedItems = [];
  dropdownSettings: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'optionId',
      textField: 'optionText',
      itemsShowLimit: 3,
      limitSelection: this.limitSelection,
      allowSearchFilter: this.ShowFilter
    };
    this.myForm = this.fb.group({
      city: [this.selectedItems]
    });
    console.log(JSON.stringify(this.limitSelection));
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    this.selectedList.emit(this.selectedItems);
  }

  onUnselectItem(item: any) {
    const index = this.selectedItems.indexOf(item);    // <-- Not supported in <IE9
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
    this.selectedList.emit(this.selectedItems);
  }

  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }
}
