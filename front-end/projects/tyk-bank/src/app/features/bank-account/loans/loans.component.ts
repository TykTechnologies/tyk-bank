import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BankAccountService } from '../bank-account.service';
import { NotificationService } from '../../../core/core.module';
import { Router } from '@angular/router';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

@Component({
  selector: 'tyk-bank-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['../bank-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoansComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  requestAmount = 0;

  constructor(private bankAccountService: BankAccountService,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit() {
  }

  requestLoan() {
    this.bankAccountService.requestLoan(this.requestAmount)
      .subscribe(res => {
        console.log(res)
        if (!res.loanAccepted) {
          this.notificationService.warn(res.message)
          return;
        }

        this.notificationService.success(res.message);
        this.router.navigateByUrl('/bank-account');
      });
  }
}
