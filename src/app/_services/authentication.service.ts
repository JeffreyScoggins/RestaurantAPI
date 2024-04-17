import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';

@Injectable()
export class AuthenticationService {
  private readonly loggedInSubject: Subject<boolean>;
  role: String;

  constructor(private http: HttpClient) {
    this.loggedInSubject = new Subject();
    console.log('in auth.service Const'); //*MES*
  }

  login(username: string, password: string) {
    console.log('In AuthenticateService login'); //*MES*
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, {username: username, password: password})
      .pipe(map(user => {
        console.log(`${environment.apiUrl}`);
        // login successful if there's a jwt token in the response
        this.role = user.role;
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.loggedInSubject.next(true);
        }
        console.log('AuthenticateService login completed'); //*MES*
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.loggedInSubject.next(false);
    console.log('in AuthenticateService logout'); //*MES*
  }

  getLoggedInSubject() {
    console.log('in AuthenticateService getLoggedInSubject'); //*MES*
    return this.loggedInSubject;
  }
}
