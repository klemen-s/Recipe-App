import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe';
import { RecipesService } from '../recipes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipe-grid',
  templateUrl: './recipe-grid.component.html',
  styleUrls: ['./recipe-grid.component.css'],
})
export class RecipeGridComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(
    private recipeService: RecipesService,
    private router: ActivatedRoute
  ) {}

  firstPage: number = 1;
  lastPage?: number = 0;

  nextPage: number = 0;
  currentPage: number = 1;
  previousPage?: number = 1;
  totalItems: number = 0;
  perPage: number = 6;

  showFirstPage?: boolean;
  showPreviousPage?: boolean;
  showNextPage?: boolean;
  showLastPage?: boolean;

  fetchRecipesByPage(page: number) {
    this.recipeService.getRecipes(page).subscribe((recipes) => {
      this.totalItems = recipes.data.getRecipes.totalItems;
      this.lastPage = Math.ceil(this.totalItems / this.perPage);

      if (this.currentPage > this.lastPage) {
        this.currentPage = 1;
        return;
      }

      this.currentPage = +this.currentPage;

      // nastavimo vrednost strani
      this.nextPage = this.currentPage + 1;
      this.previousPage = this.currentPage - 1;

      // logika, kdaj prikažemo kater gumb
      this.showFirstPage = this.currentPage > 2;
      this.showPreviousPage = this.currentPage > 1 && this.currentPage !== 1;
      this.showNextPage =
        this.nextPage > this.currentPage && this.nextPage < this.lastPage;
      this.showLastPage = this.currentPage !== this.lastPage;

      this.recipes = [...recipes.data.getRecipes.recipes];
      this.recipes = this.recipes.map((recipe) => {
        return {
          ...recipe,
          imageUrl: 'http://localhost:8080/images/' + recipe.imageUrl,
        };
      });
    });
  }

  // ob spremembi poizvedbenega parametra, se komponent še enkrat inicializira
  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      if (params['page'] === undefined) {
        this.currentPage = 1;
      } else {
        this.currentPage = params['page'];
      }

      this.fetchRecipesByPage(+this.currentPage);
    });
  }
}
