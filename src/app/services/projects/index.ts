import { Inject, Injectable } from '@angular/core';
import { createFeatureSelector, createReducer, createSelector, on, Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { EStatusState } from '@/enums';
import { fetchProjects, fulfilled, rejected } from './base';
import { initialProjectState } from './state';

export const projectReducer = createReducer(
  initialProjectState,
  on(fetchProjects, (state, { payload }) => ({ ...state, ...payload, isLoading: true, status: EStatusState.Idle })),
  on(fulfilled, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
    status: EStatusState.IsFulfilled,
  })),
  on(rejected, (state, { payload }) => ({ ...state, ...payload, isLoading: false, status: undefined })),
);

export const PROJECT_FEATURE_KEY = 'Project';
@Injectable()
export class SProject {
  select = createFeatureSelector<any>(PROJECT_FEATURE_KEY);
  isLoading;
  status;
  data: Observable<any | undefined>;

  constructor(@Inject(Store) readonly store: Store) {
    this.isLoading = this.store.select(createSelector(this.select, state => state.isLoading));
    this.status = this.store.select(createSelector(this.select, state => state.status));
    this.data = this.store.select(createSelector(this.select, state => state.data));
  }
  fetchProjects = () => this.store.dispatch(fetchProjects({ payload: {} }));
}
