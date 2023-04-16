import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/models/ingredient.model';
import { Recipe } from '../shared/models/recipe.model';
import * as ShopRedxActions from '../shopping-list/store/shopping-list.actions';
import * as ShopRedx from '../shopping-list/store/shopping-list.reducer';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe( 
      'Rec1', 
      'Dummy Recipe', 
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
      [
        new Ingredient('Beef', 1),
        new Ingredient('Fries', 10),
      ]),
    new Recipe(
      'Rec2', 
      '2nd Dummy Recipe', 
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_1280.jpg',
      [
        new Ingredient('Carrot', 2),
        new Ingredient('Tren', 3),
      ])
  ];
  
  constructor(private store: Store<ShopRedx.ApplicationState>) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number){
    return this.recipes[index];
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShopRedxActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
