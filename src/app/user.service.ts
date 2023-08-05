import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { GlobalServiceService } from './global-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService implements HttpInterceptor {
  url = 'http://localhost:8080/graphql';

  constructor(
    private http: HttpClient,
    private globalService: GlobalServiceService,
    private router: Router
  ) {}

  errorHandler(error: HttpErrorResponse) {
    let validatorError = '';
    let normalError = '';

    if (error.error.errors[0].data) {
      validatorError = error.error.errors[0].data[0].message;

      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error.errors[0].data[0].message
      );
    } else {
      normalError = error.error.errors[0].message;

      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error.errors[0].message
      );
    }

    return throwError(() => {
      const newError = new Error();

      newError.message = validatorError || normalError;

      throw newError;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.globalService.getToken()) {
      return next.handle(req);
    }

    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.globalService.getToken(),
      },
    });

    return next.handle(req);
  }
  createUser(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const graphqlQuery = {
      query: `
        mutation NewUser($name : String!, $email : String!, $password : String!, $confirmPassword : String!) {
          createUser(userInputData: {name: $name, email: $email, password: $password, confirmPassword: $confirmPassword}) {
            name
            email
            password
            recipes {
              _id
            }
            _id
          }
        }
      `,
      variables: {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
    };

    return this.http
      .post(this.url, JSON.stringify(graphqlQuery), {
        headers: headers,
      })
      .pipe(catchError(this.errorHandler));
  }

  loginUser(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const graphqlQuery = {
      query: `
        query Login($email : String, $password : String)
        {loginUser(email : $email, password : $password) {token, userId}} 
      `,
      variables: {
        email: email,
        password: password,
      },
    };

    return this.http
      .post(this.url, JSON.stringify(graphqlQuery), {
        headers: headers,
      })
      .pipe(catchError(this.errorHandler));
  }
}
