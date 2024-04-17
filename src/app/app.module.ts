import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

// used to create fake backend
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {routing} from './app.routing';

import {AlertComponent} from './_directives';
import {AuthGuard} from './_guards';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {AlertService, AuthenticationService, UserService} from './_services';
import {HomeComponent} from './home';
import {LoginComponent} from './login';
import {RegisterComponent} from './register';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {YoutubeComponent} from './youtube/youtube.component';
import {ChartOfUserAccountsComponent} from './chart-of-user-accounts/chart-of-user-accounts.component';
import {DropdownUserRolesComponent} from './dropdown-user-roles/dropdown-user-roles.component';
import {VideosListComponent} from './videos-list/videos-list.component';
import {VideosSearchComponent} from './videos-search/videos-search.component';
import {VideosPlaylistComponent} from './videos-playlist/videos-playlist.component';
import {VideoDurationPipe} from './shared/pipes/video-duration.pipe';
import {VideoPlayerComponent} from './video-player/video-player.component';
import {VideoLikesViewsPipe} from './shared/pipes/video-likes-views.pipe';
import {VideoNamePipe} from './shared/pipes/video-name.pipe';
import {LazyScrollDirective} from './shared/directives/lazy-scroll/lazy-scroll.directive';
import {YoutubeApiService} from './shared/services/youtube-api.service';
import {YoutubePlayerService} from './shared/services/youtube-player.service';
import {PlaylistStoreService} from './shared/services/playlist-store.service';
import {NotificationService} from './shared/services/notification.service';
import {BrowserNotificationService} from './shared/services/browser-notification.service';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {
  MatButtonToggleModule, MatCardModule,
  MatCheckboxModule,
  MatDialogModule, MatDividerModule, MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatSidenavModule, MatSortModule, MatTable,
  MatTableModule
} from '@angular/material';
import {HelpComponent} from './help/help.component';
import {CreateUserComponent} from './create-user/create-user.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoriesComponent } from './categories/categories.component';
import {DropdownCategoriesComponent} from './dropdown-categories/dropdown-categories.component';
import { AddItemComponent } from './add-item/add-item.component';
import {CartService} from './_services/cart.service';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ItemsByCategoryComponent } from './items-by-category/items-by-category.component';
import { ItemsPageComponent } from './items-page/items-page.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DropdownBooleanSelectorComponent } from './dropdown-boolean-selector/dropdown-boolean-selector.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {DropdownItemOptionSelectorComponent} from './dropdown-item-option-selector/dropdown-item-option-selector.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { TableSummaryComponent } from './table-summary/table-summary.component';
import { DropdownTableSelectorComponent } from './dropdown-table-selector/dropdown-table-selector.component';
import { DropdownFilterByItemSelectorComponent } from './dropdown-filter-by-item-selector/dropdown-filter-by-item-selector.component';
import { DropdownFilterByCategorySelectorComponent } from './dropdown-filter-by-category-selector/dropdown-filter-by-category-selector.component';
import {SidebarMenuComponent} from './sidebar-menu/sidebar-menu.component';
import { ItemOptionsDialogComponentComponent } from './item-options-dialog-component/item-options-dialog-component.component';
import { NotificationPopupComponent } from './notification-popup/notification-popup.component';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import { OrderHistoryDataTableComponent } from './order-history-data-table/order-history-data-table.component';
import { ServerOrderComponent } from './server-order/server-order.component';
import { WaiterRequestViewComponent } from './waiter-request-view/waiter-request-view.component';
import {NotificationConfirmationComponentComponent} from './notification-confirmation-component/notification-confirmation-component.component';
import { WaiterReadyOrderViewComponent } from './waiter-ready-order-view/waiter-ready-order-view.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { DropdownLanguageSelectorComponent } from './dropdown-language-selector/dropdown-language-selector.component';
import { CustomMessageItemDialogComponent } from './custom-message-item-dialog/custom-message-item-dialog.component';
import { OrderWizardComponent } from './order-wizard/order-wizard.component';
import {CloverAuthenticationService} from './_services/cloverAuthentication.service';
import { CategoriesByItemComponent } from './categories-by-item/categories-by-item.component';
import { UploadImageDialogComponent } from './upload-image-dialog/upload-image-dialog.component';
import {LogoutComponent} from './logout/logout.component';
import {ccAuth} from './_services/ccAuth';
import {addTipComponent} from './add-tip/add-tip.component';
import {paymentReceiptComponent} from './payment-receipt/payment-receipt.component';
import {printerListComponent} from './printer-list/printer-list.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 60,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  imports: [
    MDBBootstrapModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    FormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    HttpModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatDividerModule,
    MatCardModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatInputModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatDialogModule,
    FlexLayoutModule,

  ],
  entryComponents: [ItemOptionsDialogComponentComponent, NotificationPopupComponent, NotificationConfirmationComponentComponent, CustomMessageItemDialogComponent, UploadImageDialogComponent],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DropdownUserRolesComponent,
    DropdownCategoriesComponent,
    ChartOfUserAccountsComponent,
    YoutubeComponent,
    AppComponent,
    VideosListComponent,
    VideosSearchComponent,
    VideoPlayerComponent,
    VideosPlaylistComponent,
    VideoDurationPipe,
    VideoLikesViewsPipe,
    VideoNamePipe,
    LazyScrollDirective,
    HelpComponent,
    CreateUserComponent,
    AddCategoryComponent,
    CategoriesComponent,
    AddItemComponent,
    ViewCartComponent,
    ItemsByCategoryComponent,
    ItemsPageComponent,
    OrderHistoryComponent,
    DropdownBooleanSelectorComponent,
    DropdownItemOptionSelectorComponent,
    ViewOrdersComponent,
    TableSummaryComponent,
    DropdownTableSelectorComponent,
    DropdownFilterByItemSelectorComponent,
    SidebarMenuComponent,
    DropdownFilterByCategorySelectorComponent ,
    ItemOptionsDialogComponentComponent,
    NotificationPopupComponent ,
    OrderHistoryDataTableComponent ,
    ServerOrderComponent,
    WaiterRequestViewComponent,
    NotificationConfirmationComponentComponent,
    WaiterReadyOrderViewComponent ,
    DropdownLanguageSelectorComponent ,
    CustomMessageItemDialogComponent,
    CategoriesByItemComponent,
    OrderWizardComponent,
    LogoutComponent,
    UploadImageDialogComponent,
    addTipComponent,
    paymentReceiptComponent,
    printerListComponent,


  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    ViewCartComponent,
    UserService,
    YoutubeApiService,
    CloverAuthenticationService,
    ccAuth,
    YoutubePlayerService,
    CartService,
    PlaylistStoreService,
    NotificationService,
    BrowserNotificationService,
    addTipComponent,
    paymentReceiptComponent,
    printerListComponent,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}

  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


