import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../_models';

@Component({
  selector: 'app-dropdown-boolean-selector',
  templateUrl: './dropdown-boolean-selector.component.html',
  styleUrls: ['./dropdown-boolean-selector.component.scss']
})
export class DropdownBooleanSelectorComponent implements OnInit {

  currentUser: User;

  @Output()
  messageEvent = new EventEmitter<string>();

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
  }

  sendMessage(selected: String) {
    this.messageEvent.emit(selected.toString());
  }
}
