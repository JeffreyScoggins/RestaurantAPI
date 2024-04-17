import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {first} from 'rxjs/operators';
import {UserService} from '../_services';
import {User} from '../_models';
import {CartService} from '../_services/cart.service';

@Component({
  selector: 'app-server-order',
  templateUrl: './server-order.component.html',
  styleUrls: ['./server-order.component.scss']
})
export class ServerOrderComponent implements OnInit {
  tables: User[] = [];
  loading = true;
  currentUser: User;

  constructor(private userService: UserService, private cartService: CartService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getAllTables();
    this.cartService.removeAllFromCart();
  }

  getAllTables() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.userService.getAll(id).pipe(first()).subscribe((tables) => {
      this.tables = tables;
      this.tables = _.filter(this.tables, function(o) {
        return o.role === '3';
      });
      this.loading = false;
    });
  }

}
