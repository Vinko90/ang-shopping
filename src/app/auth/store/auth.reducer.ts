import { User } from "src/app/shared/models/user.model";
import * as authActions from "./auth.actions";

export interface AuthState {
    user: User;
}

const initialState: AuthState = {
    user: null
};

export function authReducer(state: AuthState = initialState, action: authActions.AuthActions) {
    switch (action.type) {
        case authActions.LOGIN:
            return {
                ...state,
                user: action.payload
            };
        case authActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}
