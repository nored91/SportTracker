import { Component, OnInit } from '@angular/core';
import { Account } from './account';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { empty } from 'rxjs/Observer';

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
    public msg : {};
    public msgInfo : {};

    //MS = 24h
    private timeSession = 86400000;
    //MS = 1M
    private timeCheckSession = 60000;

    //la liste des comptes existants
    private accounts : Account[];
    //Le compte connecté
    private accountConnected : Account;

    constructor(private accountService: AccountService, private router:Router) {
        this.error = {'FormLogin' : false,'FormRegister' : false};
        this.msgError = {'FormLogin' : "",'FormRegister' : ""};
        this.msg = {'FormLogin' : false,'FormRegister' : false};
        this.msgInfo = {'FormLogin' : "",'FormRegister' : ""};
        this.accountConnected = null;
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
        //On récupère les comptes
        this.accountService.getAccounts().then(
            accounts => {
                this.accounts = accounts
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

                //On récupère le hash sha256 du mdp et on cherche les comptes correspondants
                this.accountService.getHash(mdp).then(mdp => {
                    var accountConnexion = this.verifyLoginMdp(email,mdp);
                    if(accountConnexion == null){
                        this.error['FormLogin'] = true;
                        this.msgError['FormLogin'] = "Mauvais identifiants ou le compte n'existe pas";
                        return false;
                        
                    }
                    //On se connecte avec bon email et bon mdp
                    else{
                        //Le compte n'est pas validé
                        if(!accountConnexion.verify){
                            this.error['FormLogin'] = true;
                            this.msgError['FormLogin'] = "Le compte n'a pas encore été validé";
                            return false;
                        }
                        else{
                            //On maj le compte connecté
                            this.accountConnected = accountConnexion;
                            //On met en session l'ID
                            this.saveSession(accountConnexion.id);
                            //On redirige vers le tableau de bord
                            this.router.navigate(["tableau-de-bord"]);
                            //Aucune erreur
                            this.error['FormLogin'] = false;
                            //On ferme la modal
                            $('#logInModal').modal('hide');
                            return true;
                        }
                    }
                });
        });
    }

    public register(e){
        this.msg['FormRegister'] = false;
        this.error['FormRegister'] = false;
        e.preventDefault();
        //On récupère les comptes
        this.accountService.getAccounts().then(
            accounts => {
                this.accounts = accounts
                var surname = e.target.elements[0].value;
                var name = e.target.elements[1].value;
                var email = e.target.elements[2].value;
                var mdp = e.target.elements[3].value;

                if(!surname){
                    this.error['FormRegister'] = true;
                    this.msgError['FormRegister'] = "Le champ prénom est vide";
                    return false;
                }
                else if(!name){
                    this.error['FormRegister'] = true;
                    this.msgError['FormRegister'] = "Le champ nom est vide";
                    return false;
                }
                else if(!email){
                    this.error['FormRegister'] = true;
                    this.msgError['FormRegister'] = "L'adresse email est vide";
                    return false;
                }
                else if(!mdp){
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

                        //On ajoute a la liste des comptes, le compte crée
                        this.accounts.push(account);

                        //Aucune erreur sur la formulaire
                        this.msg['FormRegister'] = true;
                        this.msgInfo['FormRegister'] = "Votre compté à été crée, un administrateur va valider votre compte";
                        return false;
                    }).catch(error => {
                        this.error['FormRegister'] = true;
                        this.msgError['FormRegister'] = "Erreur à la création du compte";
                        return false;
                    });
                }
        });
    }

    private findID(account,id) : boolean{
        return id == account.id;
    }

    private saveSession(id) : void{
        //On vérifie que l'id est valide
        var a = this.accounts.find(c => this.findID(c,id));
        if(a){
            var timestamp = Date.now();
            var infoToken = ("" + a.id) + ("" + timestamp) + ("" + a.mdp) + a.email;
            var token = "";

            //On met en session le token que nous retourne le service
            this.accountService.getTokenAccount(infoToken)
            .then(data => localStorage.setItem('token', data));

            //On met en session les autres valeurs
            localStorage.setItem('id', "" + id);
            localStorage.setItem('time', "" + timestamp);
        }
    }

    //On supprime les valeurs de session lié au compte
    private removeSession() : void{
        localStorage.removeItem('id');
        localStorage.removeItem('time');
        localStorage.removeItem('token');
    }

    //Récupère l'utilisateur connecté, déconnecte l'utilisateur si la session est invalide ou expiré
    private getSession() : void {
        var result = null;
        if(localStorage.getItem('id')){
            var error = false;
            var msgError = "";
            var id = localStorage.getItem('id');
            var time = localStorage.getItem('time');
            var token = localStorage.getItem('token');

            var timeNow = Date.now();
            //1 heure en Milisecondes
            var timeSession = this.timeSession;
            if((timeNow - timeSession) > parseInt(time)){
                msgError = "Votre session à expiré";
                error = true;
            }

            //On vérifie la validité de la session
            if(!error && (id) && (time) && (token)){
                this.accountService.getAccount(id)
                .then(account => {
                    this.accountConnected = account;
                    var infoToken = account.id + time + account.mdp + account.email;
                    this.accountService.getTokenAccount(infoToken)
                    .then(tokenSent => {
                        if(tokenSent != token){
                            msgError = "Votre session n'est plus valide";
                            error = true;
                        }
                    })
                }).catch(error => {
                    this.accountConnected = null;
                })
            }

            //On déconnecte l'utilisateur si les conditions ne sont pas remplis
            if(error){
                this.logout(msgError);
            }
        }
    }

    //On déconnecte l'utilisateur courant
    public logout(msg = "") : void{
        if(msg != ""){
            $('#loggoutModal p').text(msg);
        }
        
        //On met à NULL le compte connecté
        this.accountConnected = null;
        //On supprime la session
        this.removeSession();
        //On redirige vers l'accueil
        this.router.navigate(['']);

        $('#loggoutModal').modal();
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

    /**
     * Si le formulaire a des informations à afficher
     */
    public isInfo(form){
        return !this.msg[form];
    }
    public getMsgInfo(form){
        return this.msgInfo[form];
    }

    ngOnInit() {
        this.getSession();

        //on check toutes les minutes
        setInterval(() => {
            if(this.accountConnected != null){
                this.getSession();
            }
            
        }, this.timeCheckSession);
    }
}
