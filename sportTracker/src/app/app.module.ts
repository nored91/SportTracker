import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms'; 

import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { RouterModule, Routes }   from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
      path: 'tableau-de-bord',
      component: DashboardComponent
    }
]

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    DetailsComponent,
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

