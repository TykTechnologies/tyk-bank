import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankAccountRoutingModule } from './bank-account-routing.module';

import { MatTableModule } from '@angular/material';
import { SendMoneyComponent } from './send-money/send-money.component';
import { LoansComponent } from './loans/loans.component';

@NgModule({
  declarations: [BankAccountComponent, SendMoneyComponent, LoansComponent],
  imports: [
    CommonModule,
    SharedModule,
    BankAccountRoutingModule,
    MatTableModule
  ]
})
export class BankAccountModule {}
