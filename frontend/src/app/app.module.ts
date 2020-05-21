import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PiecesVueComponent } from './pages/pieces-vue/pieces-vue.component';
import { NouvelleListeComponent } from './pages/nouvelle-liste/nouvelle-liste.component';
import { NouvellePieceComponent } from './pages/nouvelle-piece/nouvelle-piece.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ModifierListeComponent } from './pages/modifier-liste/modifier-liste.component';
import { ModifierPieceComponent } from './pages/modifier-piece/modifier-piece.component';

@NgModule({
  declarations: [
    AppComponent,
    PiecesVueComponent,
    NouvelleListeComponent,
    NouvellePieceComponent,
    LoginComponent,
    InscriptionComponent,
    ModifierListeComponent,
    ModifierPieceComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
