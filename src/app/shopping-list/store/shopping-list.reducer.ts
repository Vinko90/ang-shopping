import { Ingredient } from "../../shared/models/ingredient.model";
import * as ShopActions from "./shopping-list.actions";

export interface ApplicationState {
  shoppingList: ShopState;
}

export interface ShopState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: ShopState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state: ShopState = initialState, action: ShopActions.ShoppingListActions) {
    switch (action.type) {
        case ShopActions.ADD_INGREDIENT:
          return {
            ...state,
            ingredients: [...state.ingredients, action.payload]
          };
        case ShopActions.ADD_INGREDIENTS:
          return {
            ...state,
            ingredients: [...state.ingredients, ...action.payload]
          };
        case ShopActions.UPDATE_INGREDIENT:
          const ingredient = state.ingredients[state.editedIngredientIndex];
          const updateIngredient = {
            ...ingredient,
            ...action.payload
          };
          const updatedIngredients = [...state.ingredients];
          updatedIngredients[state.editedIngredientIndex] = updateIngredient;
          return {
            ...state,
            ingredients: updatedIngredients,
            editedIngredientIndex: -1,
            editedIngredient: null
          };
        case ShopActions.DELETE_INGREDIENT:
          return {
            ...state,
            ingredients: state.ingredients.filter((ig, igIndex) => {
              return igIndex !== state.editedIngredientIndex;
            }),
            editedIngredientIndex: -1,
            editedIngredient: null
          };
        case ShopActions.START_EDIT:
          return {
            ...state,
            editedIngredientIndex: action.payload,
            editedIngredient: { ...state.ingredients[action.payload] }
          };
        case ShopActions.STOP_EDIT:
          return {
            ...state,
            editedIngredientIndex: -1,
            editedIngredient: null
          };
        default:
          return state;
    }
}
