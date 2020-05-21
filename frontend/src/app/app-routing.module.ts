import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PiecesVueComponent } from './pages/pieces-vue/pieces-vue.component';
import { NouvelleListeComponent } from './pages/nouvelle-liste/nouvelle-liste.component';
import { NouvellePieceComponent } from './pages/nouvelle-piece/nouvelle-piece.component';
import { LoginComponent } from './pages/login/login.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ModifierListeComponent } from './pages/modifier-liste/modifier-liste.component';
import { ModifierPieceComponent } from './pages/modifier-piece/modifier-piece.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'nouvelle-liste', component: NouvelleListeComponent },
  { path: 'modifier-liste/:listeId', component: ModifierListeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'listes', component: PiecesVueComponent },
  { path: 'listes/:listeId', component: PiecesVueComponent },
  { path: 'listes/:listeId/nouvelle-piece', component: NouvellePieceComponent },
  {
    path: 'listes/:listeId/modifier-piece/:pieceId',
    component: ModifierPieceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
