import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms'; 
import { HttpModule }    from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { RouterModule, Routes }   from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountListComponent } from './account-list/account-list.component';
import { WorkoutComponent } from './workout/workout.component';
import { WorkoutFormComponent } from './workout-form/workout-form.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';

const appRoutes:Routes = [
    {
      path: 'en-savoir-plus',
      component: DetailsComponent
    },
    {
      path: '',
      component: HomeComponent
    },
    {
      path: 'accueil',
      component: HomeComponent
    },
    {
      path: 'tableau-de-bord',
      component: DashboardComponent
    },
    {
      path: 'modifier-mon-compte',
      component: AccountFormComponent
    },
    {
      path: 'administrer-les-comptes',
      component: AccountListComponent
    },
    {
      path: 'ajouter-une-seance',
      component: WorkoutFormComponent
    },
    {
      path: 'voir-mes-seances',
      component: WorkoutListComponent
    }
]

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    DetailsComponent,
    HomeComponent,
    DashboardComponent,
    AccountFormComponent,
    AccountListComponent,
    WorkoutComponent,
    WorkoutFormComponent,
    WorkoutListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxMyDatePickerModule.forRoot(),
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

