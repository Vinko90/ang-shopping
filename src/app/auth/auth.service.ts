import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../shared/models/authresponsedata.model';
import { User } from '../shared/models/user.model';

class AuthFirebaseData {
  constructor(public email: string, public password: string, public returnSecureToken: boolean) {}
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    let reqData = new AuthFirebaseData(email, password, true);
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp', reqData, { 
      params: new HttpParams().set('key', environment.apiKey) 
    })
    .pipe(catchError(this.handleErrorResponse), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  login(email: string, password: string) {
    let reqData = new AuthFirebaseData(email, password, true);
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword', reqData, { 
      params: new HttpParams().set('key', environment.apiKey) 
    })
    .pipe(catchError(this.handleErrorResponse), tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }));
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpireDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpireDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expDuration = new Date(userData._tokenExpireDate).getTime() - new Date().getTime();
      this.autoLogout(expDuration);
    }
  }

  autoLogout(expDuration: number) {
    this.tokenExpTimer = setTimeout(() => {
      this.logout();
    }, expDuration);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    this.tokenExpTimer = null;
  }

  private handleErrorResponse(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS': 
        errorMessage = 'The email address is already in use by another account';
        break;
      case 'OPERATION_NOT_ALLOWED': 
        errorMessage = 'Password sign-in is disabled for this project';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER': 
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const user = new User(email, userId, token, expDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
