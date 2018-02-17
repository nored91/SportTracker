import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from '../workout/workout';
import { Account } from '../account/account';
import { WorkoutService } from '../workout/workout.service';
import { AccountService } from '../account/account.service';
import { FormsModule }   from '@angular/forms';
import { Sanitizer } from '@angular/core';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';

declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.less'],
  providers: [WorkoutService,AccountService],
})

export class WorkoutFormComponent implements OnInit {

    public myOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: 'dd.mm.yyyy',
    };
    public model: any = {};

    public error : {};
    public msgError : {};
    public filesToUpload: Array<File> = [];
    public sanitizer;
    public workout: Workout = null;
    public account : Account;

    constructor(private workoutService: WorkoutService,private accountService: AccountService, private router:Router, private san:Sanitizer) {
        this.sanitizer = san;

        if(this.workout == null){
            this.workout = new Workout();
        }
    }

    public register(e){
        e.preventDefault();

        var name = e.target.elements[0].value;
        var date = e.target.elements[3].value;
        var typeSport = e.target.elements[4].value;
   

        if(!name){
            this.showalert("FormWorkout","Le nom de la séance est vide",'alert-danger');
            return false;
        }
        else if(!date){
            this.showalert("FormWorkout","La date est vide",'alert-danger');
            return false;
        }
        else if(!typeSport || parseInt(typeSport)==0){
            this.showalert("FormWorkout","Le champ sport est vide",'alert-danger');
            return false;
        }

        //On crée la séance
        var workoutTmp = this.workout;
        workoutTmp.id_account = this.account.id;
        workoutTmp.date = date;

        if(!workoutTmp.description){
            workoutTmp.description = "";
        }
        if(!workoutTmp.resume){
            workoutTmp.resume = "";
        }
        if(!workoutTmp.feeling){
            workoutTmp.feeling = "";
        }

        //On demande au service de créer le compte et on l'ajoute à la liste
        this.workoutService.createWorkout(workoutTmp).then(workout => {;
            if(!workout){
                this.showalert("FormWorkout","Erreur à la création de la séance",'alert-danger');
                return false;
            }
            //Aucune erreur sur la formulaire
            this.showalert("FormWorkout","Votre séance à été crée",'alert-success');
            return false;
        }).catch(error => {
            this.showalert("FormWorkout","Erreur à la création de la séance",'alert-danger');
            return false;
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

    // optional date changed callback
    public onDateChanged(event: IMyDateModel): void {
        // date selected
        $('#date').val(event.epoc);
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
