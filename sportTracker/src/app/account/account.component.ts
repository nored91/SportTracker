import { Component, OnInit } from '@angular/core';
import { Account } from './account';
import { Router } from '@angular/router';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [AccountService]
})
export class AccountComponent implements OnInit {
  accounts : Account[];
  error : boolean;

  constructor(private accountService: AccountService, private router:Router) {
    this.accounts = this.accountService.getAccount();  
    this.error = false;    
  }

  login(e){
      e.preventDefault();
      var email = e.target.elements[0].value;
      var mdp = e.target.elements[1].value;
      if(this.accountService.login(email,mdp)){
          this.router.navigate(["tableau-de-bord"]);
          this.error = false;
      }
      else{
        this.error = true;
      }
      return false;
  }

  isEmailValid(){
      return this.error;
  }

  ngOnInit() {
  }

}
