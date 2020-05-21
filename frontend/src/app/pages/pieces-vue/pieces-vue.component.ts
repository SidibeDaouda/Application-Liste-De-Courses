import { Component, OnInit } from '@angular/core';
import { PiecesService } from 'src/app/services/pieces/pieces.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Piece } from '../../models/pieces.model';
import { Liste } from '../../models/liste.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RequeteWebService } from 'src/app/services/requete-web/requete-web.service';

@Component({
  selector: 'app-pieces-vue',
  templateUrl: './pieces-vue.component.html',
  styleUrls: ['./pieces-vue.component.scss'],
})
export class PiecesVueComponent implements OnInit {
  listes: Liste[];
  pieces: Piece[];
  listeSelectionneeId: string;

  constructor(
    private piecesService: PiecesService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params.listeId) {
        this.listeSelectionneeId = params.listeId;
        this.piecesService
          .getPiece(params.listeId)
          .subscribe((pieces: Piece[]) => {
            this.pieces = pieces;
          });
      } else {
        this.pieces = undefined;
      }
    });

    this.piecesService.getListes().subscribe((listes: Liste[]) => {
      this.listes = listes;
    });
  }

  btnAcheteClick(piece: Piece) {
    // Définir la pièce pour acheté
    this.piecesService.achetee(piece).subscribe(() => {
      // la pièce a été définie comme acheté avec succès
      console.log('acheté!');
      piece.achetee = !piece.achetee;
    });
  }

  btnSuppListeClick() {
    this.piecesService
      .supprimerListe(this.listeSelectionneeId)
      .subscribe((res: any) => {
        this.router.navigate(['/listes']);
        console.log(res);
      });
  }

  btnSuppPieceClick(id: string) {
    this.piecesService
      .supprimerPiece(this.listeSelectionneeId, id)
      .subscribe((res: any) => {
        this.pieces = this.pieces.filter((val) => val._id !== id);
        console.log(res);
      });
  }

  deconnexion() {
    this.authService.deconnexion();
    // connecté avec succès
    this.router.navigate(['/login']);
  }
}
