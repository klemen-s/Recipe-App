import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeDetail } from '../recipe-detail';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipeId: null | string | undefined;
  recipeDetail: RecipeDetail = {
    title: '',
    imageUrl: '',
    description: '',
    numOfMin: 0,
    recipe: '',
    ingredients: [],
    _id: '',
    creator: '',
  };

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipesService
  ) {}

  ngOnInit(): void {
    // dobimo id recepta
    this.recipeId = this.route.snapshot.paramMap.get('recipeId');

    // dobimo recept s podanim id-jem iz pb
    this.recipeService.getRecipe(this.recipeId).subscribe((recipe: any) => {
      this.recipeDetail = {
        ...recipe.data.getRecipe,
        imageUrl:
          'https://recipe-app-express-89dbd6a6c51a.herokuapp.com/images/' +
          recipe.data.getRecipe.imageUrl,
        creator: recipe.data.getRecipe.creator.name,
      };

    });
  }
}
