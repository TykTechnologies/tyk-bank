import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { AppState } from '../../core/core.module';

import { todosReducer } from './todos/todos.reducer';
import { TodosState } from './todos/todos.model';
import { formReducer } from './form/form.reducer';
import { FormState } from './form/form.model';

export const FEATURE_NAME = 'examples';
export const selectExamples = createFeatureSelector<State, ExamplesState>(
  FEATURE_NAME
);
export const reducers: ActionReducerMap<ExamplesState> = {
  todos: todosReducer,
  form: formReducer
};

export interface ExamplesState {
  todos: TodosState;
  form: FormState;
}

export interface State extends AppState {
  examples: ExamplesState;
}
