import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {RegisterComponent} from './register';
import {AuthGuard} from './_guards';
import {ChartOfUserAccountsComponent} from './chart-of-user-accounts/chart-of-user-accounts.component';
import {YoutubeComponent} from './youtube/youtube.component';
import {HelpComponent} from './help/help.component';
import {CreateUserComponent} from './create-user/create-user.component';
import {AddCategoryComponent} from './add-category/add-category.component';
import {CategoriesComponent} from './categories/categories.component';
import {AddItemComponent} from './add-item/add-item.component';
import {ViewCartComponent} from './view-cart/view-cart.component';
import {ItemsByCategoryComponent} from './items-by-category/items-by-category.component';
import {CategoriesByItemComponent} from './categories-by-item/categories-by-item.component';
import {ItemsPageComponent} from './items-page/items-page.component';
import {OrderHistoryComponent} from './order-history/order-history.component';
import {ViewOrdersComponent} from './view-orders/view-orders.component';
import {TableSummaryComponent} from './table-summary/table-summary.component';
import {OrderHistoryDataTableComponent} from './order-history-data-table/order-history-data-table.component';
import {ServerOrderComponent} from './server-order/server-order.component';
import {WaiterRequestViewComponent} from './waiter-request-view/waiter-request-view.component';
import {WaiterReadyOrderViewComponent} from './waiter-ready-order-view/waiter-ready-order-view.component';
import {OrderWizardComponent} from './order-wizard/order-wizard.component';
import {LogoutComponent} from './logout/logout.component';
import {addTipComponent} from './add-tip/add-tip.component';
import {paymentReceiptComponent} from './payment-receipt/payment-receipt.component';
import {printerListComponent} from './printer-list/printer-list.component';

const appRoutes: Routes = [
  {path: 'order', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'userAccounts', component: ChartOfUserAccountsComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'youtube', component: YoutubeComponent, canActivate: [AuthGuard]},
  {path: 'createUser', component: CreateUserComponent, canActivate: [AuthGuard]},
  {path: 'help', component: HelpComponent, canActivate: [AuthGuard]},
  {path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard]},
  {path: 'addCategories', component: AddCategoryComponent, canActivate: [AuthGuard]},
  {path: 'addItem', component: AddItemComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: ViewCartComponent, canActivate: [AuthGuard]},
  {path: 'itemByCategory', component: ItemsByCategoryComponent, canActivate: [AuthGuard]},
  {path: 'categoriesByItem', component: CategoriesByItemComponent, canActivate: [AuthGuard]},
  {path: 'itemList', component: ItemsPageComponent, canActivate: [AuthGuard]},
  {path: 'serverOrder', component: ServerOrderComponent, canActivate: [AuthGuard]},
  {path: 'viewOrders', component: ViewOrdersComponent, canActivate: [AuthGuard]},
  {path: 'viewTableSummary', component: TableSummaryComponent, canActivate: [AuthGuard]},
  {path: 'orderHistory', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: 'orderHistoryLookup', component: OrderHistoryDataTableComponent, canActivate: [AuthGuard]},
  {path: 'waiterRequestView', component: WaiterRequestViewComponent, canActivate: [AuthGuard]},
  {path: 'readyOrderView', component: WaiterReadyOrderViewComponent, canActivate: [AuthGuard]},
  {path: 'orderWizard', component: OrderWizardComponent, canActivate: [AuthGuard]},
  {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
  {path: 'addTip', component: addTipComponent, canActivate: [AuthGuard]},
  {path: 'paymentReceipt', component: paymentReceiptComponent, canActivate: [AuthGuard]},
  {path: 'printerList', component: printerListComponent, canActivate: [AuthGuard]},

  // otherwise redirect to home
  {path: '**', redirectTo: 'home'}
];

export const routing = RouterModule.forRoot(appRoutes);

