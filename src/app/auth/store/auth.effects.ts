import { HttpClient } from "@angular/common/http";
import { Actions } from "@ngrx/effects";

export class AuthEffects {    
    //@Effect
    //authLogin = this.actions$.pipe(...)

    //authLogin = createEffect(() => this.actions$.pipe(...));
    constructor(private actions: Actions, private http: HttpClient) {}
}
