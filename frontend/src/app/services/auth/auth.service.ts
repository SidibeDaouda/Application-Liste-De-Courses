import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { RequeteWebService } from '../requete-web/requete-web.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private requeteWebService: RequeteWebService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, mdp: string) {
    return this.requeteWebService.login(email, mdp).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // les tokens d'authentification seront dans l'en-tête de cette réponse
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
        console.log('CONNECTÉ!');
      })
    );
  }

  inscription(nom: string, prenom: string, email: string, mdp: string) {
    return this.requeteWebService.inscription(nom, prenom, email, mdp).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // les tokens d'authentification seront dans l'en-tête de cette réponse
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
        console.log('Inscription réussie et maintenant connecté!');
      })
    );
  }

  deconnexion() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getIdUtilisateur() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  private setSession(
    idUtilisateur: string,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('user-id', idUtilisateur);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
    localStorage.clear();
    sessionStorage.clear();
  }

  getNewAccessToken() {
    return this.http
      .get(`${this.requeteWebService.ROOT_URL}/utilisateurs/moi/access-token`, {
        headers: {
          'x-refresh-token': this.getRefreshToken(),
          _id: this.getIdUtilisateur(),
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          this.setAccessToken(res.headers.get('x-access-token'));
        })
      );
  }
}
