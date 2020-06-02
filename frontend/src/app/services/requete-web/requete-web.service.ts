import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RequeteWebService {
  readonly ROOT_URL: string;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }
  // charge: un objet qui sera renvoyé par les requetes (titre, etc)
  post(uri: string, charge: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, charge);
  }

  patch(uri: string, charge: object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, charge);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, mdp: string) {
    return this.http.post(
      `${this.ROOT_URL}/utilisateurs/login`,
      {
        email,
        mdp,
      },
      {
        observe: 'response',
      }
    );
  }

  inscription(nom: string, prenom: string, email: string, mdp: string) {
    return this.http.post(
      `${this.ROOT_URL}/utilisateurs`,
      {
        nom,
        prenom,
        email,
        mdp,
      },
      {
        observe: 'response',
      }
    );
  }
}
