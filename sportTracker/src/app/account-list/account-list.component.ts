import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  providers: [AccountService]
})


export class AccountListComponent implements OnInit {

  public account : Account;
  public listaccount : Account[];
  public accountSelected : Account;

  constructor(private accountService: AccountService, private router:Router) {
    this.account = null;
    this.accountSelected = null;
  }

  //Retourne le nom complet
  public getFullName(a : Account) : String {
    return "" +
    a.surname.charAt(0).toUpperCase() + a.surname.toLowerCase().substring(1)
    + " " 
    + a.name.charAt(0).toUpperCase() + a.name.toLowerCase().substring(1);
  }

  //Retourne le type de compte
  public getType(a : Account) : String {
    var resultat = "";
    switch(a.rights){
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

  /**
   * On séléctionne un compte sur l'interface
   * @param account 
   */
  public onSelect(account: Account): void {
    this.accountSelected = account;
  }

  /**
   * On supprime le compte séléctionné
   * @param e l'event
   * @param account le compte
   */
  public delete(e: Event,account: Account): void{
    e.preventDefault();
    if(confirm('Voulez-vous vraiment supprimer le compte : "' + this.getFullName(account) + '"')){
      this.accountService.deleteAccount(account).then(isDelete => {
        if(isDelete){
          this.showalert("Le compte à bien été supprimé","alert-success");
          //On enlève le compte de la liste
          this.listaccount.splice(this.listaccount.indexOf(account), 1);
        }
        else{
          this.showalert("La suppression du compte à rencontré un problème","alert-warning");
        }
      });
    }
  }

  /**
   * On valide le compte séléctionné
   * @param e l'event
   * @param account le compte
   */
  public verify(e: Event,account: Account): void{
    e.preventDefault();
    //On valide la vérification
    account.verify = true;
    //On update le compte côté serveur
    this.accountService.updateAccount(account).then(accountUpdated => {
      if(accountUpdated){
        this.showalert("Le compte à bien été validé","alert-success");
        //On remplace le compte dans la liste locale
        this.listaccount[this.listaccount.indexOf(account)] = accountUpdated;
      }
      else{
        this.showalert("La validation du compte à rencontré un problème","alert-warning");
      }
    });
  }

  public search(e: Event){
    var val = $('#searchAccount').val();
    val = val.replace(new RegExp('\'', 'g'), "");
    val = val.replace(new RegExp('\"', 'g'), "");
    var filter = ' name like "%' + val + '%" or surname like "%' + val + '%" or email like "%' + val + '%"';
    //On récupère la liste de compte
    this.accountService.getAccounts(filter,"rights desc, verify asc").then(
      accounts => {
          this.listaccount = accounts
      }
    );
  }

  //Affiche une alerte bootstrap qui s'enlève au bout de 5 secondes
  public showalert(message,alerttype) {
      var time = Date.now();
      $('.container-list').prepend('<div id="alert' + time + '" class="alert ' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
      setTimeout(function() {
        $("#alert" + time).remove();
      }, 5000);
    }

  ngOnInit() {
    //On récupère le compte connecté via le service
    if(this.account == null){
      if(localStorage.getItem('id')){
        this.accountService.getAccount(localStorage.getItem('id'))
          .then(account => {
            if(account){
              this.account = account;
              //Si les droits ne sont pas adapté retours sur le tableau de bord
              if(this.account.rights != 1){
                this.router.navigate(["tableau-de-bord"]);
              }
            }
            else{
              this.router.navigate(["accueil"]);
            }
          })
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

    //On récupère la liste de compte
    this.accountService.getAccounts("","rights desc, verify asc").then(
      accounts => {
          this.listaccount = accounts
      }
    );
  }

}
