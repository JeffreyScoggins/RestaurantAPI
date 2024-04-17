import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../_models';
import {environment} from '../../environments/environment.prod';
import {throwError} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll(id: string) {
    return this.http.get<User[]>(`${environment.apiUrl}/users/getAll/${id}`);
  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/users/${id}`);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  createUser(user: User, currentUser: User) {
    if (currentUser.role === '1') {
      user.accountActive = false;
      user.role = '3';

      return this.http.post(`${environment.apiUrl}/users/register`, user);
    } else {
      throwError('You are not authorized to perform this action!');
    }
  }

  update(user: User) {
    return this.http.put(`${environment.apiUrl}/users/${user._id}`, user);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
