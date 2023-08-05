import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RecipeGridComponent } from './recipe-grid/recipe-grid.component';
import { RecipeComponent } from './recipe/recipe.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DummyComponent } from './dummy/dummy.component';
import { GlobalServiceService } from './global-service.service';
import { UserService } from './user.service';
import { authGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RecipeGridComponent,
    RecipeComponent,
    PageNotFoundComponent,
    RecipeDetailComponent,
    CreateRecipeComponent,
    RegisterComponent,
    LoginComponent,
    DummyComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'create-recipe', component: CreateRecipeComponent, canActivate: [authGuard] },
      { path: 'recipe/:recipeId', component: RecipeDetailComponent },
      { path: 'recipes', component: RecipeGridComponent},
      {path : "", redirectTo :"recipes", pathMatch : "full"},
      { path: '**', component: PageNotFoundComponent },
    ]),
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserService,
      multi : true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private globalService: GlobalServiceService) {
    this.globalService.checkLoggedInStatus();
  }
}
