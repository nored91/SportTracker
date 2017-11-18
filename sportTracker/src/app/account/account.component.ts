import { Component, OnInit } from '@angular/core';
import { Account } from './account';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [AccountService]
})
export class AccountComponent implements OnInit {
  public error : {};
  public msgError : {};

  //la liste des comptes existants
  private accounts : Account[];
  //Le compte connecté
  private accountConnected : Account;

  constructor(private accountService: AccountService, private router:Router) {
    this.error = {'FormLogin' : false,'FormRegister' : false};
    this.msgError = {'FormLogin' : "",'FormRegister' : ""};
    this.accountConnected = null;
  }
  
  //Permet de récupérer les comptes via le service AccountService
  private getAccounts(): void{
    this.accountService.getAccounts().then(accounts => this.accounts = accounts);
    
  }
  
  //Sert a la méthode verfyLoginMdp
  private findEmail(obj,val) : boolean{
    return obj.email === val;
  }

  //On vérifie le login/Mdp dans la liste de compte
  private verifyLoginMdp(email,mdp) : Account{
    if(this.accounts != null){
        var a = this.accounts.find(c => this.findEmail(c,email));
        if(a){
            if(mdp == a.mdp){
                return a
            }
        }
    }
    return null;
  }

  //On vérifie si l'email existe déjà
  private emailalreadyExist(email){
      return this.accounts.find(c => this.findEmail(c,email));
  }

  //On vient chercher à se logguer
  public login(e){
      e.preventDefault();
      var email = e.target.elements[0].value;
      var mdp = e.target.elements[1].value;
      if(!email){
          this.error['FormLogin'] = true;
          this.msgError['FormLogin'] = "L'adresse email est vide";
          return false;
      }
      if(!mdp){
          this.error['FormLogin'] = true;
          this.msgError['FormLogin'] = "Aucun mot de passe de rempli";
          return false;
      }
      var accountConnexion = this.verifyLoginMdp(email,mdp);
      if(accountConnexion == null){
          this.error['FormLogin'] = true;
            this.msgError['FormLogin'] = "Mauvais identifiants ou le compte n'existe pas";
            return false;
          
      }
      //On se connecte avec bon email et bon mdp
      else{
          //On maj le compte connecté
          this.accountConnected = accountConnexion;
          //On met en session l'ID
          localStorage.setItem('id', "" + accountConnexion.id);
          //On redirige vers le tableau de bord
          this.router.navigate(["tableau-de-bord"]);
          //Aucune erreur
          this.error['FormLogin'] = false;
          //On ferme la modal
          $('#logInModal').modal('hide');
          return true;
      }
  }

  public register(e){
      e.preventDefault();
      var surname = e.target.elements[0].value;
      var name = e.target.elements[1].value;
      var email = e.target.elements[2].value;
      var mdp = e.target.elements[3].value;

      if(!surname){
          this.error['FormRegister'] = true;
          this.msgError['FormRegister'] = "Le champ prénom est vide";
          return false;
      }
      if(!name){
          this.error['FormRegister'] = true;
          this.msgError['FormRegister'] = "Le champ nom est vide";
          return false;
      }
      if(!email){
          this.error['FormRegister'] = true;
          this.msgError['FormRegister'] = "L'adresse email est vide";
          return false;
      }
      if(!mdp){
          this.error['FormRegister'] = true;
          this.msgError['FormRegister'] = "Aucun mot de passe de rempli";
          return false;
      }

      if(this.emailalreadyExist(email)){
        this.error['FormRegister'] = true;
        this.msgError['FormRegister'] = "L'adresse email est déjà liée à un compte";
        return false;
          
      }
      //On se connecte avec bon email et bon mdp
      else{
          //On demande au service de créer le compte et on l'ajoute à la liste
          this.accountService.createAccount(surname,name,mdp,email).then(account => {
            //On renseigne le compte connecté
            this.accountConnected = account;
            //On met en session l'ID
            localStorage.setItem('id', "" + account.id);
            //On ajoute a la liste des comptes, le compte crée
            this.accounts.push(account);
            //On redirige vers le tableau de bord
            this.router.navigate(["tableau-de-bord"]);
            //Aucune erreur sur la formulaire
            this.error['FormRegister'] = false;
            
            //On ferme la modal
            $('#registerModal').modal('hide');
            return true
          }).catch(error => {
                this.error['FormRegister'] = true;
                this.msgError['FormRegister'] = "Erreur à la création du compte";
                return false;
            });
      }
  }

  public logout() : void{
    //On met à NULL le compte connecté
    this.accountConnected = null;
    //On supprime l'ID en session
    localStorage.removeItem('id');
    //On redirige vers l'accueil
    this.router.navigate(['']);
  } 


  /**
   * Si le formulaire est valide
   */
  public isValid(form){
      return !this.error[form];
  }
  public getMsgError(form){
      return this.msgError[form];
  }

  ngOnInit() {
      //On recupère tous les comptes
      this.getAccounts();

      //On récupère le compte en session
      if(this.accountConnected == null){
        if(localStorage.getItem('id')){
          this.accountService.getAccount(localStorage.getItem('id'))
            .then(account => {this.accountConnected = account;})
        }
      }
  }

}
