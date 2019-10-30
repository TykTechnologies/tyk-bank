import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bank-account',
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./features/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'bank-account',
    loadChildren: () =>
      import('./features/bank-account/bank-account.module').then(
        m => m.BankAccountModule
      )
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: '**',
    redirectTo: 'bank-account'
  }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
