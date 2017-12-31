import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms'; 
import { HttpModule }    from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { RouterModule, Routes }   from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountListComponent } from './account-list/account-list.component';
import { WorkoutComponent } from './workout/workout.component';

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
    WorkoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

