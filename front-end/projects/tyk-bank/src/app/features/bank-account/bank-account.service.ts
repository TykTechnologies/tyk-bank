import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Http2ServerRequest } from 'http2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { OAuthService } from 'angular-oauth2-oidc';

export interface Transaction {
  sender: number;
  recipient: number;
  amount: number;
  date?: Date;
}

const MAKE_TRANSACTION = gql`
  mutation makeTransaction($sender: ID!, $recipient: ID!, $amount: Int!) {
    makeTransaction(
      input: { recipient: $recipient, sender: $sender, amount: $amount }
    ) {
      id
      date
      amount
      sender {
        ...userFragment
      }
      recipient {
        ...userFragment
      }
    }
  }

  fragment userFragment on User {
    id
    name
    balance
  }
`;

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  constructor(private apollo: Apollo, private http: HttpClient, private oauthService: OAuthService) { }

  makeTransaction(sender: string, recipient: string, amount: number) {
    return this.apollo
      .mutate({
        mutation: MAKE_TRANSACTION,
        variables: {
          sender: sender,
          recipient: recipient,
          amount: amount
        }
      })
      .pipe();
  }


  requestLoan(loanAmount): Observable<any> {
    return this.http.get("http://localhost:8080/loan-service-api/loan",
    {
      headers: {
        Authorization: 'Bearer ' +  this.oauthService.getIdToken()
      },
      params: {
        loanAmount: loanAmount
      }
    });
}

}
