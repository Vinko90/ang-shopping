import { ActionReducerMap } from "@ngrx/store";

import * as authReducer from "./auth/store/auth.reducer";
import * as shopReducer from "./shopping-list/store/shopping-list.reducer";

export interface ApplicationState {
    shoppingList: shopReducer.ShopState;
    auth: authReducer.AuthState;
}

export const appReducer: ActionReducerMap<ApplicationState> = {
    shoppingList: shopReducer.shoppingListReducer,
    auth: authReducer.authReducer
};
