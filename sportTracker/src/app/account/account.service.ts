import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Account } from './account';

@Injectable()
export class AccountService {

    private accounts : Promise<Account[]>;
    private headers = new Headers({'Content-Type': 'application/json'});
    private accountConnected: Account;
    constructor(private http: Http) {
        this.accounts = this.getAccounts();
        this.accountConnected = null;
    }

    //Récupère les comptes via l'API
    getAccounts(): Promise<Account[]> {
        return this.http.get("/api/account/list")
            .toPromise()
            .then(response => response.json().data as Account[])
            .catch(this.handleError);
    }

    //Récupère le compte identifié par id via l'API
    getAccount(id): Promise<Account> {
        return this.http.get(`/api/account/${id}`)
            .toPromise()
            .then(response => response.json().data as Account)
            .catch(this.handleError);
    }

    //Crée le compte et renvoi le compte créé
    createAccount(surname,name,mdp,email): Promise<Account> {
        return this.http.post("/api/account/create", JSON.stringify({surname:surname,name:name,mdp:mdp,email:email}), {headers: this.headers})
            .toPromise()
            .then(response => response.json().data as Account)
            .catch(this.handleError);
    }

    //Recupère le hash sha256 de la valeur envoyé
    getTokenAccount(infoToken) : Promise<string>{
        return this.http.post("/api/hash", JSON.stringify({data:infoToken}), {headers: this.headers})
            .toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }
        
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}