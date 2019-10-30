import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuardService } from '../../core/core.module';

const routes: Routes = [
  {
    path: 'profile',
    component: UserProfileComponent,
    data: { title: 'tyk.menu.user-profile' },
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
