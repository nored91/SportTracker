import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account';
import { FormsModule }   from '@angular/forms';
import { Sanitizer } from '@angular/core';

declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-account-form',
    templateUrl: './account-form.component.html',
    styleUrls: ['./account-form.component.css'],
    providers: [AccountService],
})
export class AccountFormComponent implements OnInit {
    public error : {};
    public msgError : {};
    public account : Account;
    public filesToUpload: Array<File> = [];
    public sanitizer;

    constructor(private accountService: AccountService, private router:Router, private san:Sanitizer) {
        this.account = null;
        this.error = {'FormAccount' : false,'FormEmail' : false,'FormMdp' : false};
        this.msgError = {'FormAccount' : "",'FormEmail' : "",'FormMdp' : ""};
        this.sanitizer = san;
    }

    //On vient chercher à se logguer
    public updateAccount(e){
        e.preventDefault();
        var isMdpChange = false;
        
        //Le compte temporaire modifié
        var tmp = this.account;
        var form = "form1";
        if(e.target.id == "formAccount"){
            var name = e.target.elements[1].value;
            var surname = e.target.elements[2].value;

            if(!name){
                this.showalert(form,"Le champ 'nom' est vide",'alert-danger');
                return false;
            }
            if(!surname){
                this.showalert(form,"Le champ 'prénom' est vide",'alert-danger');
                return false;
            }
        }
        else if(e.target.id == "formEmail"){
            form = "form2";
            var email = e.target.elements[0].value;

            if(!email){
                this.showalert(form,"Le champ 'email' est vide",'alert-danger');
                return false;
            }
        }
        else if(e.target.id == "formMdp"){
            form = "form3";
            var mdp = e.target.elements[0].value;

            if(!mdp){
                this.showalert(form,"Le champ 'mot de passe' est vide",'alert-danger');
                return false;
            }
            tmp.mdp = mdp;
            isMdpChange = true;
        }

        //On demande à node de MAJ
        this.accountService.updateAccount(tmp,isMdpChange).then(a => {
            //On maj le compte connecté
            this.account = a;
            this.accountService.getAccounts();

            //On redirige vers la page
            this.router.navigate(["modifier-mon-compte"]);
            this.showalert(form,"Le compte à bien été modifié",'alert-success');
            return true;
        });
    }

    //Affiche une alerte bootstrap qui s'enlève au bout de 5 secondes
    public showalert(id,message,alerttype) {
        var time = Date.now();
        $('#' + id).append('<div style="height:38px !important;padding-top:5px !important;" id="alert' + time + '" class="alert ' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
        setTimeout(function() {
        $("#alert" + time).remove();
        }, 5000);
    }

    /**
     * Upload de l'image du compte
     * @param e - L'évenement
     */
    public upload(e){
        e.preventDefault();
        
        var files: Array<File> = this.filesToUpload;
        if(files.length > 0){
            var formData: any = new FormData();
            formData.append("photo", files[0], files[0]['name']);
            formData.append('id',this.account.id);
            //On met à jour le compte
            this.accountService.upload(formData).then(data => {
                if(data){
                    this.account.photo = data;
                    this.showalert("form4","La photo à été mise à jour",'alert-success');
                }
                else{
                    this.showalert("form4","Extension incorrect",'alert-danger');
                }
            }).catch(function(data){
                this.showalert("form4","Une erreur s'est produite",'alert-danger');
            });
        }
        else{
            this.showalert("form4","Aucun fichier ajouté",'alert-danger');
        }
    }

    //Quand on change d'image
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
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
