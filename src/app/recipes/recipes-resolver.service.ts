import { Injectable } from "@angular/core";

import { Recipe } from "../shared/models/recipe.model";
import { DataStorageService } from "../shared/data-storage.service";
import { Observable } from "rxjs";
import { RecipeService } from "./recipe.service";

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService {
    
    constructor(private dataStorage: DataStorageService, private recipesService: RecipeService) {
    }

    resolve(): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipesService.getRecipes();

        if (recipes.length === 0) {
            return this.dataStorage.loadRecipes();
        } else {
            return recipes;
        }
    }
}
