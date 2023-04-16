import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/models/ingredient.model';
import * as ShopRedxActions from '../store/shopping-list.actions';
import * as ShopRedx from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') sflForm: NgForm;
  subscription: Subscription;
  editMode: boolean = false;
  editedItem: Ingredient;

  constructor(private store: Store<ShopRedx.ApplicationState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.sflForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  onAddItem(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShopRedxActions.UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new ShopRedxActions.AddIngredient(newIngredient));
    }
    this.clearForm();
  }

  onDelete() {
    this.store.dispatch(new ShopRedxActions.DeleteIngredient());
    this.clearForm();
  }

  clearForm() {
    this.editMode = false;
    this.sflForm.reset();
    this.store.dispatch(new ShopRedxActions.StopEdit());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShopRedxActions.StopEdit());
  }
}
