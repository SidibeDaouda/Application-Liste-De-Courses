import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, empty, Subject } from 'rxjs';
import { AuthService } from '../app/services/auth/auth.service';
import { catchError, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebReqInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  refreshingAccessToken: boolean;

  accessTokenRefreshed: Subject<any> = new Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Gérer la demande
    request = this.addAuthHeader(request);

    // appeler next () et gérer la réponse
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if (error.status === 401) {
          // Erreur 401 donc nous ne sommes pas autorisés
          // rafraîchir le token d'accès
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              request = this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              console.log(err);
              this.authService.deconnexion();
              return empty();
            })
          );
        }

        return throwError(error);
      })
    );
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable((observer) => {
        this.accessTokenRefreshed.subscribe(() => {
          // ce code s'exécutera lorsque le token d'accès aura été actualisé
          observer.next();
          observer.complete();
        });
      });
    } else {
      this.refreshingAccessToken = true;
      // appeler une méthode dans le service d'authentification pour envoyer une demande de rafraîchissement du token d'accès
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          // tslint:disable-next-line: quotemark
          console.log("Token d'accès actualisé !");
          this.refreshingAccessToken = false;
          this.accessTokenRefreshed.next();
        })
      );
    }
  }

  addAuthHeader(request: HttpRequest<any>) {
    // obtenir le token d'accès
    const token = this.authService.getAccessToken();

    if (token) {
      // ajouter le token d'accès à l'en-tête de la demande
      return request.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }
    return request;
  }
}
