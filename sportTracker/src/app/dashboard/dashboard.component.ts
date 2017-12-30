import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account';
import { Sanitizer } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  providers: [AccountService]
})
export class DashboardComponent implements OnInit {

  public account : Account;
  public sanitizer;

  constructor(private accountService: AccountService, private router:Router,private san:Sanitizer) {
    this.account = null;
    this.sanitizer = san;
  }

  //Retourne le nom complet
  public getFullName() : String {
    return "" +
    this.account.surname.charAt(0).toUpperCase() + this.account.surname.toLowerCase().substring(1)
    + " " 
    + this.account.name.charAt(0).toUpperCase() + this.account.name.toLowerCase().substring(1);
  }
  
  //Retourne le type de compte
  public getType() : String {
    var resultat = "";
    switch(this.account.rights){
        case 0 : 
            resultat = "Compte SMT";
            break;
        case 1 :
            resultat = "Administrateur";
            break;
        default : 
            resultat = "";
            break;
    }
    return resultat;
  }

  //Pour clean la source en base 64
  cleanURL(url): String {
    return   this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
  
  ngOnInit() {
    //On récupère le compte connecté via le service
    if(this.account == null){
      if(localStorage.getItem('id')){
        this.accountService.getAccount(localStorage.getItem('id'))
          .then(account => {this.account = account;})
          .catch(function(){
            //Si on a pas de compte connecté => on redirige sur l'accueil
            this.router.navigate(["accueil"]);
          });
      }
      else{
        //Si on a pas de compte connecté => on redirige sur l'accueil
        this.router.navigate(["accueil"]);
      }
    }
  }
}
