import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { UserService } from '../../user/user.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'tyk-about',
  templateUrl: './bank-account.component.html',
  styleUrls: ['../bank-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankAccountComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  releaseButler = require('../../../../assets/release-butler.png');
  displayedColumns: string[] = ['date', 'description', 'from', 'to', 'amount'];

  user_balance: Observable<number>;
  user_name: Observable<string>;
  transactions: Observable<any[]>;

  constructor(private userService: UserService) {
    const user = this.userService.getCurrentUserData();
    if (user == null) {
      return
    }
    
    this.user_balance = user.pipe(
      map(res => {
        return res.balance;
      })
    );

    this.user_name = user.pipe(
      map(res => {
        return res.name;
      })
    );

    this.transactions = user.pipe(
      map(res => {
        res && res.transactions && res.transactions.forEach(element => {
          element.description = 'Money Transfer';
          element.date = element.date.substr(0, 16).replace('T', ' ');
        });
        return res.transactions;
      }),
      startWith([])
    );
  }

  ngOnInit() {}
}
