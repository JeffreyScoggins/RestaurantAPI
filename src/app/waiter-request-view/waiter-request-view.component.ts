import { Component, OnInit } from '@angular/core';
import {ServerRequestService} from '../_services/serverRequest.service';
import {first} from 'rxjs/operators';
import {ServerRequest} from '../_models/serverRequest';
import * as _ from 'lodash';
import {User} from '../_models';

@Component({
  selector: 'app-waiter-request-view',
  templateUrl: './waiter-request-view.component.html',
  styleUrls: ['./waiter-request-view.component.scss']
})
export class WaiterRequestViewComponent implements OnInit {

  waiterRequests: ServerRequest[] = [];
  loading = true;
  currentUser: User;
  loadingButton = false;

  constructor(private requestServerService: ServerRequestService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllWaiterRequests();
  }

  loadAllWaiterRequests() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.requestServerService.getAll(id).pipe(first()).subscribe(request => {
      this.waiterRequests = request;
      this.loading = false;
    });
  }

  deleteServerRequest(id: string) {
    this.loadingButton = true;
    this.requestServerService.delete(id).subscribe(() => {
      const index = _.findIndex(this.waiterRequests, (waiterRequest) => waiterRequest.id === id);
      this.waiterRequests.splice(index, 1);
      this.loadingButton = false;
    });
  }

}
