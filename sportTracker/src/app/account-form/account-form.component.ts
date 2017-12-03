import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-account-form',
    templateUrl: './account-form.component.html',
    styleUrls: ['./account-form.component.css'],
    providers: [AccountService]
})
export class AccountFormComponent implements OnInit {
    public error : {};
    public msgError : {};
    public account : Account;
    constructor(private accountService: AccountService, private router:Router) {
        this.account = null;
        this.error = {'FormAccount' : false,'FormEmail' : false,'FormMdp' : false};
        this.msgError = {'FormAccount' : "",'FormEmail' : "",'FormMdp' : ""};
    }

    //On vient chercher à se logguer
    public updateAccount(e){
        e.preventDefault();
        var isMdpChange = false;
        
        //Le compte temporaire modifié
        var tmp = this.account;
        if(e.target.id == "formAccount"){
            var name = e.target.elements[1].value;
            var surname = e.target.elements[2].value;

            if(!name){
                this.error['FormAccount'] = true;
                this.msgError['FormAccount'] = "Le champ 'nom' est vide";
                return false;
            }
            if(!surname){
                this.error['FormAccount'] = true;
                this.msgError['FormAccount'] = "Le champ 'prénom' est vide";
                return false;
            }

            tmp.name = name;
            tmp.surname = surname;
        }
        else if(e.target.id == "formEmail"){
            var email = e.target.elements[0].value;

            if(!email){
                this.error['FormEmail'] = true;
                this.msgError['FormEmail'] = "Le champ 'email' est vide";
                return false;
            }

            tmp.email = email;
        }
        else if(e.target.id == "formMdp"){
            var mdp = e.target.elements[0].value;

            if(!mdp){
                this.error['FormMdp'] = true;
                this.msgError['FormMdp'] = "Le champ 'mot de passe' est vide";
                return false;
            }

            isMdpChange = true;
            tmp.mdp = mdp;
        }

        //On demande à node de MAJ
        this.accountService.updateAccount(tmp,isMdpChange).then(a => {
            //On maj le compte connecté
            this.account = a;
            this.accountService.getAccounts();

            //On redirige vers la page
            this.router.navigate(["modifier-mon-compte"]);

            //Aucune erreur
            $("#" + e.target.id + " .alert").fadeIn(500);
            $("#" + e.target.id + " .alert").click(function(){
                $(this).fadeOut(500);
            });
            this.error[e.target.id] = false;
            return true;
        });
    }

    //Si le formulaire est valide
    public isValid(form){
        return !this.error[form];
    }

    //Renvoie les messages d'erreur du formulaire
    public getMsgError(form){
        return this.msgError[form];
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
