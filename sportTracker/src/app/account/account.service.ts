import { Injectable } from '@angular/core';
import { Account } from './account';

@Injectable()
export class AccountService {

    getAccount(): Account[] {
        var  t = [];
        t["test@test.fr"] =  { id: 1, name: 'Mr. Nice' ,mdp: 'test', email: 'test@test.fr' };
        
        return t;
    } // stub

    login(email,mdp){
        var accounts = this.getAccount();
        if(accounts[email]){
            var accountEmail = accounts[email];
            return mdp == accountEmail.mdp;
        }
        return false;
    }
}