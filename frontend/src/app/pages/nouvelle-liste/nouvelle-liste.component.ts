import { Component, OnInit } from '@angular/core';
import { PiecesService } from '../../services/pieces/pieces.service';
import { Router } from '@angular/router';
import { Liste } from '../../models/liste.model';
@Component({
  selector: 'app-nouvelle-liste',
  templateUrl: './nouvelle-liste.component.html',
  styleUrls: ['./nouvelle-liste.component.scss'],
})
export class NouvelleListeComponent implements OnInit {
  constructor(private piecesService: PiecesService, private router: Router) {}

  ngOnInit() {}

  creerListe(titre: string) {
    this.piecesService.creerListe(titre).subscribe((liste: Liste) => {
      console.log(liste);
      // Maintenant, nous naviguons vers /listes/liste._id
      this.router.navigate(['/listes', liste._id]);
    });
  }
}
