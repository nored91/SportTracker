import { Injectable } from '@angular/core';
import { Account } from './account';

@Injectable()
export class AccountService {

    getAccount(): Account[] {
        var  t = [];
        t[0] =  { id: 1, name: 'Mr. Nice' ,mdp: 'test', email: 'test@test.fr' };
        
        return t;
    } // stub
}