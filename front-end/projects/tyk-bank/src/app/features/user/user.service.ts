import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from '../bank-account/bank-account.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Store } from '@ngrx/store';

import {
  authLogout,
  AppState,
  NotificationService
} from '../../core/core.module';

export interface User {
  transactions?: Transaction[];
  balance?: number;
  name?: string;
  address?: Address;
}

export interface Address {
  city?: string;
  street?: string;
  country?: string;
  postalCode?: string;
}

const FETCH_USER_QUERY = gql`
  query fetchUserQuery($userId: ID!) {
    user(id: $userId) {
      id
      balance
      name
      address {
        city
        country
        street
        postalCode
      }
      transactions(first: 10) {
        id
        amount
        date
        sender {
          name
          balance
        }
        recipient {
          name
          balance
        }
      }
    }
  }
`;

const FETCH_ALL_USERS = gql`
  query fetchaAllUsersQuery {
    users {
      id
      name
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $name: String!, $address: AddressInput) {
    updateUserDetails(
      userID: $userId
      input: { name: $name, address: $address }
    ) {
      name
      address {
        street
        city
        postalCode
        country
      }
    }
  }
`;

// TODO: Switch to Observables pattern
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private apollo: Apollo, 
    private oauthService: OAuthService, 
    private notificationService: NotificationService,
    private store: Store<AppState>,
    ) {}

  public getCurrentUserData(): Observable<any> {
    if (!this.oauthService.hasValidIdToken()) {
      console.log("No ID Token found!")
      this.notificationService.error("No ID Token found")
      return
    }
    else if (!this.oauthService.getIdentityClaims()['graphql_id']) {
      console.log("No `Graphql_ID` Token found!")
      this.notificationService.error("No `Graphql_ID` Token found in the User Claims!")
      return
    }

    return this.apollo
      .query({
        query: FETCH_USER_QUERY,
        variables: {
          userId: this.oauthService.hasValidIdToken()
            ? this.oauthService.getIdentityClaims()['graphql_id']
            : ''
        },
        fetchPolicy: 'no-cache' // Constantly updating, don't use cache
      })
      .pipe(map(res => res.data['user']));
  }

  public getAllUsers(): Observable<any> {
    return this.apollo
      .query({ query: FETCH_ALL_USERS })
      .pipe(map(res => res.data['users']));
  }

  // issue a log out
  // empty session storage, and set "is_authenticated flag to false"
  // then redirect to home page
  public signOut() {
    this.store.dispatch(authLogout());
    this.oauthService.logOut();
  }

  public updateUser(
    userId: string,
    name: string,
    address: Address
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: UPDATE_USER,
      variables: {
        userId: userId,
        name: name,
        address: address
      }
    });
  }
}
