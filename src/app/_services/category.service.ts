import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Category} from '../_models/category';
import {environment} from '../../environments/environment.prod';
import {Observable} from 'rxjs';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class CategoryService {

  categories: Observable<Category[]>;

  constructor(private http: HttpClient) { }

  getAll(id: string) {
    if (_.isNil(this.categories)) {
      const response = this.http.get<Category[]>(`${environment.apiUrl}/categories/getAll/${id}`);
      this.categories = response;
      return response;
    } else {
      return this.categories;
    }
  }

  getById(id: string) {// TODO
    return this.http.get(`${environment.apiUrl}/categories/${id}`);
  }

  createCategory(category: Category) {
      return this.http.post(`${environment.apiUrl}/categories/register`, category);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/categories/${id}`);
  }
}

