import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';

@Injectable()
export class CloverAuthenticationService {
  private readonly loggedInSubject: Subject<boolean>;
  role: String;

  constructor(private http: HttpClient) {
    this.loggedInSubject = new Subject();
    console.log('In CloverAuthenticate Constructor'); //*MES
  }

  login(merchantId: string, client_id: string, code: string) {
    console.log('In CloverAuthenticate login :' + merchantId + " client :" + client_id + " code :" + code ); //*MES
    return this.http.post<any>(`${environment.apiUrl}/cloverApi/authenticate`, {merchantId: merchantId, client_id: client_id, code: code})
      .pipe(map(token => {
        console.log("returned from authenticate login" + `${environment.apiUrl}`);

        // login successful if there's a jwt token in the response
        this.role = token.role;
        if (token && token.access_token) {
          console.log('successful login :' + token); //*MES*
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('clover_access_token', token.access_token);
          this.setCookie('clover_access_token_cookie', 'Generic User', 364); //expires in 364 days as token only last 365
          console.log('in clover auth.service login completed. Cookie Stored under username: ' + this.getLoggedInSubject()); //*MES*
          return token;
        }
      }));
  }


  logout() {
    // remove user from local storage to log user out
    console.log('in clover auth.service logout'); //*MES*
    sessionStorage.clear();
    this.loggedInSubject.next(false);
  }

  getLoggedInSubject() {
    console.log('in clover auth.service getLoggedInSubject'); //*MES*
    return this.loggedInSubject;
  }

  setCookie(name, value, expireDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expireDays*24*60*60*1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
}
