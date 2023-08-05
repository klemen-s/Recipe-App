import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent {
  // dobimo vrednosti, ko se naloži recipe-grid in jih podamo v RecipeComponent (Recipe interface (title,imageUrl,numOfMins))
  @Input() recipe: Recipe = { imageUrl: '', title: '', numOfMin: 0, _id: '' };
}
