import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './_services';
import {User} from './_models';
import {NavigationStart, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
  navbar = false;
  currentUser: User;
  showMenu: boolean;
  loginPage: boolean;

  constructor(private authService: AuthenticationService,
              private router: Router, private translate: TranslateService) {
    var URL_id = '';
    console.log('app.component.ts Constructor: ', router.events) ; //*MES*
    translate.setDefaultLang('English');
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        console.log("each event url :" + event.url);
        this.showMenu = !event.url.includes('/login') && event.url !== '/register';
        this.loginPage = event.url.includes('/login');
      }
    });
    this.authService.getLoggedInSubject().subscribe(response => {
      this.navbar = response;
    });
  }

  ngOnInit() {
    console.log('app.component.ts OnInit'); //*MES*
  }
}
