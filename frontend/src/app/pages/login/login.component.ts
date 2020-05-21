import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {}

  btnLoginClick(email: string, mdp: string) {
    this.authService.login(email, mdp).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        // connecté avec succès
        console.log(res.body);
        this.router.navigate(['/listes']);
      }
    });
  }
}
