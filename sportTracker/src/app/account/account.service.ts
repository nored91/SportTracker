import { Injectable } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Account } from './account';

@Injectable()
export class AccountService {

    private accounts : Promise<Account[]>;
    constructor(private http: Http) {
        this.accounts = this.getAccounts();
    }

    public getAccounts(): Promise<Account[]> {
        return this.http.get("/api/account/list")
                    .toPromise()
                    .then(response => response.json().data as Account[])
                    .catch(this.handleError);
    }
        
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    public login(email,mdp){
        console.log(this.accounts);
        if(this.accounts[email]){
            var accountEmail = this.accounts[email];
            return mdp == accountEmail.mdp;
        }
        //On maj les accounts
        this.accounts = this.getAccounts();
        return false;
    }
}