import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Workout } from '../workout/workout';
import { WorkoutService } from '../workout/workout.service';
import { FormsModule }   from '@angular/forms';
import { Sanitizer } from '@angular/core';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-workout-form',
  templateUrl: './workout-form.component.html',
  styleUrls: ['./workout-form.component.less'],
  providers: [WorkoutService],
})



export class WorkoutFormComponent implements OnInit {

  public error : {};
  public msgError : {};
  public filesToUpload: Array<File> = [];
  public sanitizer;

  constructor(private workoutService: WorkoutService, private router:Router, private san:Sanitizer) {
      this.error = {'FormWorkout' : false};
      this.msgError = {'FormWorkout' : ""};
      this.sanitizer = san;
  }

  public register(e){
    this.msgError['FormWorkout'] = "";
    this.error['FormWorkout'] = false;
    e.preventDefault();

      
      var name = e.target.elements[0].value;
      var date = e.target.elements[1].value;
      var resume = e.target.elements[2].value;
      var description = e.target.elements[3].value;
      var typeSport = e.target.elements[4].value;
      var duration = e.target.elements[5].value
      var feeling = e.target.elements[6].value

      if(!name){
          this.error['FormWorkout'] = true;
          this.msgError['FormWorkout'] = "Le nom de la séance est vide";
          return false;
      }
      else if(!date){
          this.error['FormWorkout'] = true;
          this.msgError['FormWorkout'] = "La date est vide";
          return false;
      }
      else if(!typeSport){
          this.error['FormWorkout'] = true;
          this.msgError['FormWorkout'] = "Le champ sport est vide";
          return false;
      }

      //On crée la séance
      var workoutTmp = new Workout;
      workoutTmp.name = name;
      workoutTmp.date = date;
      workoutTmp.resume = resume;
      workoutTmp.description = description;
      workoutTmp.typeSport = typeSport;
      workoutTmp.duration = duration;
      workoutTmp.feeling = feeling;

      //On demande au service de créer le compte et on l'ajoute à la liste
      this.workoutService.createWorkout(workoutTmp).then(workout => {
          console.log(workout);

          //Aucune erreur sur la formulaire
          this.error['FormWorkout'] = false;
          this.msgError['FormWorkout'] = "Votre séance à été crée";
          return false;
      }).catch(error => {
          this.error['FormWorkout'] = true;
          this.msgError['FormWorkout'] = "Erreur à la création de la séance";
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

  ngOnInit() {
  }

}
