import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from '../workout/workout';
import { Account } from '../account/account';
import { WorkoutService } from '../workout/workout.service';
import { AccountService } from '../account/account.service';

declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.less'],
  providers: [WorkoutService,AccountService],
})
export class WorkoutListComponent implements OnInit {

  public account : Account;
  public listworkout : Workout[];
  public workoutSelected : Workout;
  constructor(private workoutService: WorkoutService,private accountService: AccountService, private router:Router) {
    this.workoutSelected = null;
  }

   /**
   * On séléctionne un compte sur l'interface
   * @param account 
   */
  public onSelect(workout: Workout): void {
    this.workoutSelected = workout;
  }

  /**
   * On supprime le compte séléctionné
   * @param e l'event
   * @param account le compte
   */
  public delete(e: Event,workout: Workout): void{
    e.preventDefault();
    if(confirm('Voulez-vous vraiment supprimer la séance : "' + workout.name + '"')){
      this.workoutService.deleteWorkout(workout).then(isDelete => {
        if(isDelete){
          this.showalert("La séance à bien été supprimé","alert-success");
          //On enlève le compte de la liste
          this.listworkout.splice(this.listworkout.indexOf(workout), 1);
          this.workoutSelected = null;
        }
        else{
          this.showalert("La suppression de la séance à rencontré un problème","alert-warning");
        }
      });
    }
  }

  //Affiche une alerte bootstrap qui s'enlève au bout de 5 secondes
  public showalert(message,alerttype) {
    var time = Date.now();
    $('.container-list').prepend('<div id="alert' + time + '" class="alert ' +  alerttype + '"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
    setTimeout(function() {
      $("#alert" + time).remove();
    }, 5000);
  }

  public getDateFormat(timestamp){
    var date = new Date(timestamp *1000);
    return ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()) + '/' + ((date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth()) + '/' + date.getFullYear();
  }

  public getTypeSport(type){
    return this.workoutService.getListTypeSport()[type]
  }

  ngOnInit() {
    //On récupère le compte connecté via le service
    if(this.account == null){
        if(localStorage.getItem('id')){
            this.accountService.getAccount(localStorage.getItem('id'))
                .then(account => {
                  this.account = account;
                  //On récupère la liste
                  this.workoutService.getWorkouts(" id_account = " + this.account.id,"date desc").then(
                    workouts => {
                        this.listworkout = workouts
                    }
                  );
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
    else{
      //On récupère la liste
      this.workoutService.getWorkouts(" id = " + this.account.id,"date desc").then(
        workouts => {
            this.listworkout = workouts
        }
      );
    }
  }

}
