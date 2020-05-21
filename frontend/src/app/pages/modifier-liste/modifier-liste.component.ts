import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PiecesService } from 'src/app/services/pieces/pieces.service';

@Component({
  selector: 'app-modifier-liste',
  templateUrl: './modifier-liste.component.html',
  styleUrls: ['./modifier-liste.component.scss'],
})
export class ModifierListeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private piecesService: PiecesService,
    private router: Router
  ) {}

  listeId: string;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listeId = params.listeId;
      console.log(params.listeId);
    });
  }

  majListe(titre: string) {
    this.piecesService.majListe(this.listeId, titre).subscribe(() => {
      this.router.navigate(['/listes', this.listeId]);
    });
  }
}
