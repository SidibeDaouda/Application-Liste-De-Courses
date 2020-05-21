import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PiecesService } from 'src/app/services/pieces/pieces.service';

@Component({
  selector: 'app-modifier-piece',
  templateUrl: './modifier-piece.component.html',
  styleUrls: ['./modifier-piece.component.scss'],
})
export class ModifierPieceComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private piecesService: PiecesService,
    private router: Router
  ) {}

  pieceId: string;
  listeId: string;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.pieceId = params.pieceId;
      this.listeId = params.listeId;
    });
  }

  majPiece(titre: string) {
    this.piecesService
      .majPiece(this.listeId, this.pieceId, titre)
      .subscribe(() => {
        this.router.navigate(['/listes', this.listeId]);
      });
  }
}
