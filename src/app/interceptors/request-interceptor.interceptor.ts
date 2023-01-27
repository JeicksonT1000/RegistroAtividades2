import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem('__authenticationToken__');

    request.headers.set('Content-Type', 'application/json');

    if (token) {
      const cloneReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(cloneReq);
    } else {
      return next.handle(request);
    }
  }
}

export const RequestInterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptorInterceptor,
    multi: true,
  },
];
