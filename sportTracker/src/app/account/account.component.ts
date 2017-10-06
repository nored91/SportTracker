import { Component, OnInit } from '@angular/core';
import { Account } from './account';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [AccountService]
})
export class AccountComponent implements OnInit {
  account : Account[];

  constructor(private accountService: AccountService) {
    this.account = this.accountService.getAccount();      
  }

  ngOnInit() {
  }

}
