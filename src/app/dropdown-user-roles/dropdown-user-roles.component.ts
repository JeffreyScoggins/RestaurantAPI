import {Component, Input, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '../_models';
import {UserService} from '../_services';

@Component({
  selector: 'app-dropdown-user-roles',
  templateUrl: './dropdown-user-roles.component.html',
  styleUrls: ['./dropdown-user-roles.component.scss']
})
export class DropdownUserRolesComponent implements OnInit {
  currentUser: User;

  @Input()
  user: User;

  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  onOptionSelect(selected: string, user: User) {
    if (this.currentUser.role === '1' || this.currentUser.role === '2') {
      user.role = selected;
      this.userService.update(user).pipe(first()).subscribe(() => {
      });
    }
  }

  public userRole(role: String) {
    if (role === '1') {
      return 'Admin';
    } else if (role === '2') {
      return 'Manager';
    } else if (role === '3') {
      return 'Table';
    } else if (role === '4') {
      return 'Kiosk';
    }
  }

  ngOnInit() {
  }

}
