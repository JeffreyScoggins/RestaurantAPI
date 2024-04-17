import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Item} from '../_models/Item';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {Category} from '../_models/category';

@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private http: HttpClient) { }

  items: Observable<Item[]>;

  getAll(id: string) {
    if (_.isNil(this.items)) {
      const response = this.http.get<Item[]>(`${environment.apiUrl}/items/getAll/${id}`);
      this.items = response;
      return response;
    } else {
      return this.items;
    }
  }

  getById(id: number) {
    return this.http.get(`${environment.apiUrl}/items/${id}`);
  }

  createItem(item: Item) {
      return this.http.post(`${environment.apiUrl}/items/register`, item);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/items/${id}`);
  }

  getItemByCategoryUuid(categoryUuid: string) {
    return this.http.get<Item[]>(`${environment.apiUrl}/items/categoryUuid/${categoryUuid}`);
  }
}

