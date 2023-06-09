import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from './models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private baseUrl: string = environment.firebaseUrl;

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.baseUrl + '/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  loadRecipes() {
    return this.http.get<Recipe[]>(this.baseUrl + '/recipes.json')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }
}
