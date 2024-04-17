 import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '../_models';
import {UserService} from '../_services';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-chart-of-user-accounts',
  templateUrl: './chart-of-user-accounts.component.html',
  styleUrls: ['./chart-of-user-accounts.component.scss']
})
export class ChartOfUserAccountsComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  allUsers: User[] = [];
  sortTracker = 0;
  accountBalanceError = false;
  editField: string;
  loading = true;

  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  deactivateUser(user: User, currentUser: User) {
    if (currentUser.role === '1' || currentUser.role === '2') {
      user.accountActive = false;

      this.userService.update(user).pipe(first()).subscribe(() => {
        this.loadAllUsers();
      });
    }
  }

  activateUser(user: User, currentUser: User) {
    if (currentUser.role === '1' || currentUser.role === '2') {
      user.accountActive = true;

      this.userService.update(user).pipe(first()).subscribe(() => {
        this.loadAllUsers();
      });
    }
  }

  resetPassword(user: User, currentUser: User) {
    if (this.currentUser.role === '1' || this.currentUser.role === '2') {
      const passwordInput = prompt('Enter New Password:');
      if (passwordInput !== null && passwordInput !== '') {
        if (passwordInput.length > 6) {
          user.password = passwordInput.toString();
          this.userService.update(user).pipe(first()).subscribe(() => {
            this.loadAllUsers();
          });
        } else {
          throwError('Password too short');
        }
      }
    } else {
      throwError('You are not authorized to perform this action!');
    }
  }

  private loadAllUsers() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.userService.getAll(id).pipe(first()).subscribe(users => {
      users.sort((x, y) => Number(x.accountActive) - Number(y.accountActive));
      this.users = users;
      this.allUsers = users;
      this.loading = false;
    });
  }

  public loadUsersBySearch() {
    this.users = this.allUsers;
    const search: string = (<HTMLInputElement>document.getElementById('myInput')).value;
    if (search.length === 0 || search.length === null) {
      this.users = this.allUsers;
    } else {
      const result = this.users.filter(users => users.username.includes(search) ||
        users.firstName.includes(search) ||
        users.lastName.includes(search));
      this.users = result;
    }
  }


  public isAdmin(user: User) {
    if (user.role === '1') {
      return true;
    } else {
      return false;
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

  public resetInput() {
    this.loadAllUsers();
  }

  public sortByFirstName() {
    if (this.sortTracker === 0) {
      this.users.sort(function (x, y) {
        if (x.firstName < y.firstName) {
          return -1;
        }
        if (x.firstName > y.firstName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort(function (x, y) {
        if (x.firstName > y.firstName) {
          return -1;
        }
        if (x.firstName < y.firstName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByLastName() {
    if (this.sortTracker === 0) {
      this.users.sort(function (x, y) {
        if (x.lastName < y.lastName) {
          return -1;
        }
        if (x.lastName > y.lastName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort(function (x, y) {
        if (x.lastName > y.lastName) {
          return -1;
        }
        if (x.lastName < y.lastName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByUsername() {
    if (this.sortTracker === 0) {
      this.users.sort(function (x, y) {
        if (x.username < y.username) {
          return -1;
        }
        if (x.username > y.username) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort(function (x, y) {
        if (x.username > y.username) {
          return -1;
        }
        if (x.username < y.username) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountType() {
    if (this.sortTracker === 0) {
      this.users.sort(function (x, y) {
        if (x.role < y.role) {
          return -1;
        }
        if (x.role > y.role) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort(function (x, y) {
        if (x.role > y.role) {
          return -1;
        }
        if (x.role < y.role) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountDeactive() {
    if (this.sortTracker === 0) {
      this.users.sort((x, y) => Number(x.accountActive) - Number(y.accountActive));
      this.sortTracker = 1;
    } else {
      this.users.sort((x, y) => Number(y.accountActive) - Number(x.accountActive));
      this.sortTracker = 0;
    }
  }

  changeValue(userId: User, property: string, event: any) {
    this.serviceCallUpdateBasedOnAttribute(property, event, userId);

  }

  public serviceCallUpdateBasedOnAttribute(typeOfChange: string, event: any, userId: User) {
    this.editField = event.target.innerText;
    const updatedUser = new User();
    updatedUser._id = userId._id;

    switch (typeOfChange) {
      case 'fName': {

        updatedUser.firstName = this.editField;
        this.userService.update(updatedUser).pipe(first()).subscribe(() => {
          this.loadAllUsers();
        });
        break;
      }
      case 'lName': {
        updatedUser.lastName = this.editField;
        this.userService.update(updatedUser).pipe(first()).subscribe(() => {
          this.loadAllUsers();
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  deleteUserTable(id: string) {
    this.userService.delete(id).subscribe(() => {
      this.loadAllUsers();
    });
  }
}
