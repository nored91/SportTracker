import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Account } from './account';

@Injectable()
export class AccountService {

    private accounts : Promise<Account[]>;
    constructor(private http: Http) {
        this.accounts = this.getAccounts();
    }

    //Récupère les comptes via l'API
    getAccounts(): Promise<Account[]> {
        return this.http.get("/api/account/list")
            .toPromise()
            .then(response => response.json().data as Account[])
            .catch(this.handleError);
    }
        
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}