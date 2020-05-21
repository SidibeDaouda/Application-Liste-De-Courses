import { Component, OnInit } from '@angular/core';
import { PiecesService } from 'src/app/services/pieces/pieces.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Piece } from '../../models/pieces.model';

@Component({
  selector: 'app-nouvelle-piece',
  templateUrl: './nouvelle-piece.component.html',
  styleUrls: ['./nouvelle-piece.component.scss'],
})
export class NouvellePieceComponent implements OnInit {
  constructor(
    private piecesService: PiecesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  listeId: string;
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.listeId = params.listeId;
    });
  }

  creerPiece(titre: string) {
    this.piecesService
      .creerPiece(titre, this.listeId)
      .subscribe((nouvellePiece: Piece) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
