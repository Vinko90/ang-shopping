import { Action } from "@ngrx/store";

import { User } from "src/app/shared/models/user.model";

export const LOGIN = '[Auth].LOGIN';
export class Login implements Action {
    readonly type = LOGIN;
    constructor(public payload: User) {}
}

export const LOGOUT = '[Auth].LOGOUT';
export class Logout implements Action {
    readonly type = LOGOUT;
}

export const LOGIN_START = '[Auth].LOGIN_START';
export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: { email: string; password: string; }) {}
}

export type AuthActions =
    | Login
    | Logout
    | LoginStart;
