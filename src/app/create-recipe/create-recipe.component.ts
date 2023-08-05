import { Component } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { RecipeDetail } from '../recipe-detail';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.css'],
})
export class CreateRecipeComponent {
  title?: any;
  imageUrl?: any = '';
  description?: any = '';
  numOfMin?: any = 0;
  recipe?: any = '';
  ingredients?: any;
  formReset: any;
  postSuccess: boolean = false;
  errorMessage: string = '';
  isError: boolean = false;

  constructor(private recipeService: RecipesService, private router: Router) {}

  modalHandler() {
    this.postSuccess = !this.postSuccess;
  }

  submitHandler($event: any) {
    $event.preventDefault();

    const formData = new FormData();

    // pošljemo kot post request na /post-image, ki nam vrne pot do datoteke na našem disku
    this.imageUrl = document.getElementById('image');
    formData.append('image', this.imageUrl.files[0]);

    this.recipeService.postImage(formData).subscribe({
      next: (data) => {
        // data.filePath = naslov slike na backendu, kjer statično hostamo slike (majhna aplikacija)
        this.title = document.getElementById('title');
        const titleValue = this.title.value;

        this.description = document.getElementById('description');
        const descriptionValue = this.description.value;

        this.numOfMin = document.getElementById('numOfMin');
        const numOfMinValue = parseInt(this.numOfMin.value);

        let ingredientsValue;
        this.ingredients = document.getElementById('ingredients');
        ingredientsValue = this.ingredients.value.split(',');

        if (ingredientsValue[0] === '') {
          ingredientsValue = [];
        }

        this.recipe = document.getElementById('recipeInstructions');
        const recipeValue = this.recipe.value;

        if (
          !titleValue ||
          !descriptionValue ||
          !numOfMinValue ||
          !ingredientsValue ||
          !recipeValue
        ) {
          this.isError = true;
          this.errorMessage = 'Please fill out all input fields!';
          return;
        }

        this.recipeService
          .postRecipe(
            titleValue,
            data.filePath,
            descriptionValue,
            recipeValue,
            ingredientsValue,
            numOfMinValue
          )
          .subscribe({
            next: (recipe) => {
              this.formReset = document.getElementById('myForm');
              this.formReset.reset();

              this.isError = false;
              this.postSuccess = true;

              setTimeout(() => {
                this.router.navigate(['/recipes'], {
                  queryParams: { page: 1 },
                });
              }, 700);
            },
            error: (error) => {
              this.errorMessage = error.message;
              this.isError = true;
            },
          });
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isError = true;
      },
    });
  }
}
