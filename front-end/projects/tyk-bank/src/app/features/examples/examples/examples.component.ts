import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../core/core.module';

import { State } from '../examples.state';

@Component({
  selector: 'tyk-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  examples = [
    { link: 'todos', label: 'tyk.examples.menu.todos' },
    { link: 'theming', label: 'tyk.examples.menu.theming' },
    { link: 'crud', label: 'tyk.examples.menu.crud' },
    {
      link: 'simple-state-management',
      label: 'tyk.examples.menu.simple-state-management'
    },
    { link: 'form', label: 'tyk.examples.menu.form' },
    { link: 'notifications', label: 'tyk.examples.menu.notifications' },
    { link: 'elements', label: 'tyk.examples.menu.elements' },
    { link: 'authenticated', label: 'tyk.examples.menu.auth', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
