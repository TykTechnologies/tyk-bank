import browser from 'browser-detect';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthConfig } from 'angular-oauth2-oidc';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpHeaders } from '@angular/common/http';

import { environment as env } from '../../environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  authLogin,
  authLogout,
  routeAnimations,
  AppState,
  LocalStorageService,
  selectIsAuthenticated,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme
} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage
} from '../core/settings/settings.actions';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'http://docker.for.mac.localhost:8081/auth/realms/master',
  requireHttps: false,
  logoutUrl: window.location.origin,
  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: 'tyk-bank',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email voucher'
};

@Component({
  selector: 'tyk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = require('../../assets/Basic_Tyk1.png');
  languages = ['en', 'de', 'sk', 'fr', 'es', 'pt-br', 'zh-cn', 'he'];
  navigationSideMenu = [{ link: 'settings', label: 'tyk.menu.settings' }];

  isAuthenticated$: Observable<boolean>;
  stickyHeader$: Observable<boolean>;
  language$: Observable<string>;
  theme$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService,
    private oauthService: OAuthService,
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    this.configure();

    const http = httpLink.create({
      uri: 'http://localhost:8080/graphql/'
    });

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set(
          'Authorization',
          'Bearer ' + this.oauthService.getIdToken()
        )
      });

      return forward(operation);
    });

    apollo.create({
      link: concat(authMiddleware, http),
      cache: new InMemoryCache()
    });
  }

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name);
  }

  ngOnInit(): void {
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
  }

  onLoginClick() {
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }

  onLogoutClick() {
    this.store.dispatch(authLogout());
    this.oauthService.logOut();
  }

  onLanguageSelect({ value: language }) {
    this.store.dispatch(actionSettingsChangeLanguage({ language }));
  }

  private configure() {
    this.oauthService.configure(authConfig);
    // For Debugging
    // this.oauthService.events.subscribe(e =>
    //   e instanceof OAuthErrorEvent ? console.error(e) : console.warn(e)
    // );
    this.oauthService.loadDiscoveryDocument();
    this.oauthService.tryLogin().then( response => {
      // check if we are logged in and set the stage
      if (this.oauthService.hasValidIdToken()) {
        this.store.dispatch(authLogin());
      } else {
        this.store.dispatch(authLogout())
      }
    })
    
  }
}
