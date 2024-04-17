import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {ServerRequest} from '../_models/serverRequest';

@Injectable({ providedIn: 'root' })
export class ServerRequestService {

  constructor(private http: HttpClient) {
  }

  getAll(id: string) {
    return this.http.get<ServerRequest[]>(`${environment.apiUrl}/serverRequest/getAll/${id}`);
  }

  createOrder(serverRequest: ServerRequest) {
    return this.http.post(`${environment.apiUrl}/serverRequest/register`, serverRequest);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/serverRequest/${id}`);
  }

}

