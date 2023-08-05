import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalServiceService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkLoggedInStatus();
  }

  public getToken() : string | null {
    return localStorage.getItem('jwtToken');
  }

  checkLoggedInStatus() {
    const jwtToken = localStorage.getItem('jwtToken');
    const isLoggedIn = jwtToken !== null;
    this.isLoggedInSubject.next(isLoggedIn);
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  updateIsLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }
}
