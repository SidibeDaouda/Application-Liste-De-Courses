import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
})
export class InscriptionComponent implements OnInit {
  mdp = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {}

  btnInscriptionClick(nom: string, prenom: string, email: string, mdp: string) {
    this.authService
      .inscription(nom, prenom, email, mdp)
      .subscribe((res: HttpResponse<any>) => {
        console.log(res);
        this.router.navigate(['/listes']);
      });
  }
}
