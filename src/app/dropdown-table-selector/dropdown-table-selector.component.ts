import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableOrderService} from '../_services/tableOrder.service';
import {TableOrder} from '../_models/tableOrder';
import {first} from 'rxjs/operators';
import {User} from '../_models';
import {UserService} from '../_services';
import * as _ from 'lodash';

@Component({
  selector: 'app-dropdown-table-selector',
  templateUrl: './dropdown-table-selector.component.html',
  styleUrls: ['./dropdown-table-selector.component.scss']
})
export class DropdownTableSelectorComponent implements OnInit {

  @Input()
  defaultTableUsername: string;
  // defaultTableUUid: string;

  @Output()
  tableUsername = new EventEmitter<string>();
  // tableUuid = new EventEmitter<string>();

  // tables: TableOrder[] = [];
  tables: User[] = [];
  currentUser: User;

  constructor(private userService: UserService, private tableOrderService: TableOrderService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    // this.loadAllTables();
    this.getAllTables();

  }

  getAllTables() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.userService.getAll(id).pipe(first()).subscribe((tables) => {
      this.tables = tables;
      console.log(tables);
      this.tables = _.filter(this.tables, function(o) {
        return o.role === '3';
      });
      console.log("again: ", this.tables);
 //     this.loading = false;
    });
  }

  // loadAllTables() {
  //   const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
  //   this.tableOrderService.getAll(id).pipe(first()).subscribe(table => {
  //     this.tables = table;
  //     console.log(table);
  //   });
  // }

  sendMessage(selected: String) { 
    this.tableUsername.emit(selected.toString());
    // this.tableUuid.emit(selected.toString());
  }
}
