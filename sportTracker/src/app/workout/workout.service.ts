import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Workout } from './workout';

@Injectable()
export class WorkoutService {

    private headers = new Headers({'Content-Type': 'application/json'});
    constructor(private http: Http) {}

    //Récupère les workout via l'API
    getWorkouts(filter = "",orderby = ""): Promise<Workout[]> {
        return this.http.post("/api/workout/list",JSON.stringify({filter:filter,orderby:orderby}), {headers: this.headers})
            .toPromise()
            .then(response => response.json().data as Workout[])
            .catch(this.handleError);
    }

    //Récupère le workout identifié par id via l'API
    getWorkout(id): Promise<Workout> {
        return this.http.get(`/api/workout/${id}`)
            .toPromise()
            .then(response => response.json().data as Workout)
            .catch(this.handleError);
    }

    updateWorkout(Workout : Workout, isMdpChange = false): Promise<Workout> {
        return this.http.post("/api/workout/update", JSON.stringify({id:Workout.id,name:Workout.name,description:Workout.description,resume:Workout.resume,duration:Workout.duration,feeling:Workout.feeling,typeSport:Workout.typeSport}), {headers: this.headers})
        .toPromise()
        .then(response => response.json().data as Workout)
        .catch(this.handleError);
    }

    deleteWorkout(Workout : Workout): Promise<Boolean> {
        return this.http.post("/api/workout/delete", JSON.stringify({id:Workout.id}), {headers: this.headers})
        .toPromise()
        .then(response => (response.json().resultat == 'OK') as Boolean)
        .catch(this.handleError);
    }

    //Crée le workout et renvoi le workout créé
    createWorkout(Workout : Workout): Promise<Workout> {
        return this.http.post("/api/workout/create", JSON.stringify({id:Workout.id,id_account:Workout.id_account,name:Workout.name,description:Workout.description,resume:Workout.resume,duration:Workout.duration,feeling:Workout.feeling,typeSport:Workout.typeSport}), {headers: this.headers})
            .toPromise()
            .then(response => response.json().data as Workout)
            .catch(this.handleError);
    }

        
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}