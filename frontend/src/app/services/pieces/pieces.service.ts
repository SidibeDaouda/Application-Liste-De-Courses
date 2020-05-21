import { Injectable } from '@angular/core';
import { RequeteWebService } from '../requete-web/requete-web.service';
import { Piece } from '../../models/pieces.model';

@Injectable({
  providedIn: 'root',
})
export class PiecesService {
  constructor(private requeteWebService: RequeteWebService) {}

  getListes() {
    return this.requeteWebService.get('listes');
  }

  creerListe(titre: string) {
    // envoyer une requete Web pour créer une liste
    return this.requeteWebService.post('listes', { titre });
  }

  majListe(id: string, titre: string) {
    // envoyer une requete Web pour mettre à jour une liste
    return this.requeteWebService.patch(`listes/${id}`, { titre });
  }

  majPiece(listeId: string, pieceId: string, titre: string) {
    // envoyer une requete Web pour mettre à jour une liste
    return this.requeteWebService.patch(`listes/${listeId}/pieces/${pieceId}`, {
      titre,
    });
  }

  supprimerPiece(listeId: string, pieceId: string) {
    return this.requeteWebService.delete(`listes/${listeId}/pieces/${pieceId}`);
  }

  supprimerListe(id: string) {
    return this.requeteWebService.delete(`listes/${id}`);
  }

  getPiece(listeId: string) {
    return this.requeteWebService.get(`listes/${listeId}/pieces`);
  }

  creerPiece(titre: string, listeId: string) {
    // envoyer une requete web pour créer une pièce
    return this.requeteWebService.post(`listes/${listeId}/pieces`, { titre });
  }

  achetee(piece: Piece) {
    return this.requeteWebService.patch(
      `listes/${piece._listeId}/pieces/${piece._id}`,
      { achetee: !piece.achetee }
    );
  }
}
