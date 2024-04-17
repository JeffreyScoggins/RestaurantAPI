import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Image} from '../_models/image';
import {environment} from '../../environments/environment.prod';
import {Observable} from 'rxjs';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class ImageService {

  categoryImages: Observable<Image[]>;
  itemImages: Observable<Image[]>;

  constructor(private http: HttpClient) { }

  getAllCategories(id: string) {
    if (_.isNil(this.categoryImages)) {
      const response = this.http.get<Image[]>(`${environment.apiUrl}/images/getAllCategories/${id}`);
      this.categoryImages = response;
      return response;
    } else {
      return this.categoryImages;
    }
    // return this.http.get<Image[]>(`${environment.apiUrl}/images/getAllCategories/${id}`);
  }

  getAllItems(id: string) {
    if (_.isNil(this.itemImages)) {
      const response = this.http.get<Image[]>(`${environment.apiUrl}/images/getAllItems/${id}`);
      this.itemImages = response;
      return response;
    } else {
      return this.itemImages;
    }
    // return this.http.get<Image[]>(`${environment.apiUrl}/images/getAllItems/${id}`);
  }

  getById(id: string) {// TODO
    return this.http.get(`${environment.apiUrl}/images/${id}`);
  }

  createImage(image: Image) {
      return this.http.post(`${environment.apiUrl}/images/register`, image);
  }

  updateImage(image: Image) {
    return this.http.post(`${environment.apiUrl}/images/update`, image);
}

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/images/${id}`);
  }
}

