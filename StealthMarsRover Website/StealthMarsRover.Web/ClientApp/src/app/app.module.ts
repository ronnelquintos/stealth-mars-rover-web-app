import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { MarsRoverService } from "./services/mars-rover.service";
import { LottieModule } from "ngx-lottie";
import player from "lottie-web";
import { DatePipe } from '@angular/common';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    LottieModule.forRoot({ player: playerFactory }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' }
    ])
  ],
  providers: [
    MarsRoverService,
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
