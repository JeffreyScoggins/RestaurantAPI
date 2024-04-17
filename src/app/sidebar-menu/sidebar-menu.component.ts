import {Component, OnInit} from '@angular/core';
import { User } from '../_models';
import {AuthenticationService, UserService} from '../_services';
import {Observable} from 'rxjs';
import {Item} from '../_models/Item';
import {MatDialog} from '@angular/material';
import {YoutubePlayerService} from '../shared/services/youtube-player.service';
import {CartService} from '../_services/cart.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import Pusher from 'pusher-js';
import { LineItem } from '../_models/lineItem';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  public shoppingCartItems$: Observable<LineItem[]>;
  currentUser: User;
  role: String;
  opened: boolean;

  constructor(private dialog: MatDialog,
              private youtubePlayer: YoutubePlayerService,
              private userService: UserService,
              private router: Router,
              private authService: AuthenticationService,
              private cartService: CartService,
              private notifier: NotifierService) {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('in sidebar menu - constructor ' + this.currentUser); //*MES*


    this.shoppingCartItems$ = this
      .cartService
      .getItems();

    this.shoppingCartItems$.subscribe(_ => _);
    this.role = authService.role;
    const pusher = new Pusher('0fce1d9fc729dc6facf5', {
      cluster: 'mt1',
      forceTLS: true,
      contentType: JSON
    });

    const channel = pusher.subscribe('order-channel');
    channel.bind('new-order', data => {
      if (data.added === true && data.orgUuid === this.currentUser._id) {
        this.playAudio();
      }
    });
  }

  ngOnInit() {
    console.log('in sidebar menu - onInit '); //*MES*
    if (this.currentUser ? (this.currentUser.role !== '3' && this.currentUser.role !== '4') : false) {
      this.pusherConfig();
    }
  }

  logout() {

    console.log('in sidebar menu - logout '+ this.currentUser); //*MES*
    localStorage.setItem('currentUser', null);
    localStorage.setItem('orderId', null);
    this.router.navigate(['login']);
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  change(id: string) {
    document.getElementById(id);
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '../../assets/notification.mp3';
    audio.load();
    audio.play();
  }

  pusherConfig() {
    const pusher = new Pusher('0fce1d9fc729dc6facf5', {
      cluster: 'mt1',
      forceTLS: true,
      contentType: JSON
    });

    const channel = pusher.subscribe('server-request');
    channel.bind('server-request-created', data => {
      if (this.currentUser.role !== '3' && data.orgUuid === this.currentUser._id) {
        this.showNotification('success', data.message);
      }
    });
  }
}
