import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {OrderHistory} from '../_models/orderHistory';
import {OrderHistoryService} from '../_services/orderHistory.service';
import {Angular5Csv} from '../../../node_modules/angular5-csv/dist/Angular5-csv';
import {User} from '../_models';

@Component({
  selector: 'app-order-history-data-table',
  templateUrl: './order-history-data-table.component.html',
  styleUrls: ['./order-history-data-table.component.scss']
})
export class OrderHistoryDataTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  renderedData: any;
  orderHistories: OrderHistory[] = [];

  dataSource =  new MatTableDataSource<OrderHistory>(this.orderHistories);
  displayedColumns = ['name', 'price', 'createdDate', 'selectedOptions'];
  sortedData: OrderHistory[] = [];
  currentUser: User;

  constructor(private orderHistoryService: OrderHistoryService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loadOrderHistories();
    this.sortedData = this.sortedData.slice();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrderHistories() {
    const id = this.currentUser.orgUuid ?  this.currentUser.orgUuid : this.currentUser._id;
    this.orderHistoryService.getAll(id).subscribe(orderHistories => {
      this.orderHistories = orderHistories;
      this.dataSource.data = this.orderHistories;
      this.dataSource.connect().subscribe(d => this.renderedData = d);
    }, error => console.log(error));
  }

  dateChange() {

    const startDate = new Date((<HTMLInputElement>document.getElementById('startDate')).value);
    const endDate = new Date((<HTMLInputElement>document.getElementById('endDate')).value);

    startDate.setHours(24,59,59,0);
    endDate.setDate(endDate.getDate() + 1);

    this.orderHistories = [];
    this.orderHistoryService.getByDate(startDate, endDate).subscribe(orderHistories => {
      this.orderHistories = orderHistories;
      this.dataSource.data = this.orderHistories;
    }, error => console.log(error));
  }

  exportCsv() {
    new Angular5Csv(this.renderedData, 'Transaction Report');
  }
}
