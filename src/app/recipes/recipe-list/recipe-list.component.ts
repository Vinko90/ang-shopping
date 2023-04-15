import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../../shared/models/recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private recipeListSubscription: Subscription;
  recipes: Recipe[];

  constructor(private recipeService: RecipeService, private router: Router, private currentRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.recipeListSubscription = this.recipeService.recipesChanged
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      })
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.currentRoute });
  }

  ngOnDestroy(): void {
    this.recipeListSubscription.unsubscribe();
  }
}
