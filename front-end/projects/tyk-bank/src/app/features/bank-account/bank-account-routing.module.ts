import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankAccountComponent } from './bank-account/bank-account.component';
import { AuthGuardService } from '../../core/core.module';
import { SendMoneyComponent } from './send-money/send-money.component';
import { LoansComponent } from './loans/loans.component';

const routes: Routes = [
  {
    path: '',
    component: BankAccountComponent,
    data: { title: 'tyk.menu.about' },
    canActivate: [AuthGuardService]
  },
  {
    path: 'send-money',
    component: SendMoneyComponent,
    data: { title: 'tyk.menu.about' },
    canActivate: [AuthGuardService]
  },
  {
    path: 'request-loan',
    component: LoansComponent,
    data: { title: 'tyk.menu.about' },
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule {}
