import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../user/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankAccountService } from '../bank-account.service';
import { NotificationService } from '../../../core/core.module';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

@Component({
  selector: 'tyk-bank-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['../bank-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendMoneyComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  constructor(
    private router: Router,
    private userService: UserService,
    private bankAccountService: BankAccountService,
    private notificationService: NotificationService
  ) {}

  users: Observable<any[]>;
  currentUserId: string;
  selectedRecipientId = '';
  amountToSend: number;

  ngOnInit() {
    this.userService.getCurrentUserData().subscribe(userDataPayload => {
      this.currentUserId = userDataPayload.id;
      // nested API calls because one depends on the other
      this.users = this.userService.getAllUsers().pipe(
        map(res => {
          return res.filter(user => user.id !== this.currentUserId);
        })
      );
    });
  }

  sendMoney() {
    this.bankAccountService
      .makeTransaction(
        this.currentUserId,
        this.selectedRecipientId,
        this.amountToSend
      )
      .subscribe(res => {
        this.notificationService.success('Money successfully sent.');
        this.router.navigateByUrl('/bank-account');
      });
  }
}
