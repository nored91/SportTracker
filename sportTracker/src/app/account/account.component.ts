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
  error : boolean;
  msgError : string;

  constructor(private accountService: AccountService, private router:Router) {
    this.error = false;
    this.msgError = "";
  }

  public login(e){
      e.preventDefault();
      var email = e.target.elements[0].value;
      var mdp = e.target.elements[1].value;
      if(!email){
          this.error = true;
          this.msgError = "L'adresse email est vide";
          return false;
      }
      if(!mdp){
          this.error = true;
          this.msgError = "Aucun mot de passe de rempli";
          return false;
      }
      if(!this.accountService.login(email,mdp)){
          this.error = true;
            this.msgError = "Mauvais identifiants ou le compte n'existe pas";
            return false;
          
      }
      //On se connecte avec bon email et bon mdp
      else{
          this.router.navigate(["tableau-de-bord"]);
          this.error = false;

          //On ferme la modal
          $('#logInModal').modal('hide');
          return true;
      }
  }

  /**
   * Si l'email est valide
   * True si il est valide, False sinon
   */
  public isEmailValid(){
      return !this.error;
  }

  /**
   * Pour retourne le message d'erreur
   */
  public getMsgError(){
      return this.msgError;
  }

  ngOnInit() {
  }

}
