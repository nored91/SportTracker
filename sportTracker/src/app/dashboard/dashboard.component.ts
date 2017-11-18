import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AccountService]
})
export class DashboardComponent implements OnInit {

  public account : Account;
  constructor(private accountService: AccountService, private router:Router) {
    this.account = null;
  }
  

  ngOnInit() {
    //On récupère le compte connecté via le service
    if(this.account == null){
      if(localStorage.getItem('id')){
        this.accountService.getAccount(localStorage.getItem('id'))
          .then(account => {this.account = account;})
          .catch(function(){
            //Si on a pas de compte connecté => on redirige sur l'accueil
            this.router.navigate([""]);
          });
      }
      else{
        //Si on a pas de compte connecté => on redirige sur l'accueil
        this.router.navigate([""]);
      }
    }
  }

}
