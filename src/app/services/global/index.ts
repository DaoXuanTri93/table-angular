import { Inject, Injectable } from '@angular/core';
import { createAction, createFeatureSelector, createReducer, createSelector, on, props, Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { EStatusState } from '@/enums';
import type { IMUser } from '@/interfaces/model';
import { checkLanguage } from '@/utils';
import { getAll } from '../product/base';
import { fulfilled, postLogin, rejected } from './base';
import { initialState, type StateGlobal } from './state';

export const set = createAction('[GLOBAL] Set', props<{ payload: any }>());
export const setLanguage = createAction('[GLOBAL] Set Language', props<{ payload: any }>());

export const globalReducer = createReducer(
  initialState,
  on(postLogin, (state, { payload }) => ({ ...state, ...payload, isLoading: true, status: EStatusState.Idle })),
  on(fulfilled, (state, { payload }) => ({
    ...state,
    ...payload,
    isLoading: false,
    status: EStatusState.IsFulfilled,
  })),
  on(rejected, (state, { payload }) => ({ ...state, ...payload, isLoading: false, status: undefined })),
  on(set, (state, { payload }) => ({ ...state, ...payload })),
  on(setLanguage, (state, action) => {
    if (action.payload !== state.language) {
      const payload = checkLanguage(action.payload);
      return { ...state, ...payload };
    }
    return state;
  }),
  on(getAll, state => ({ ...state, isLoading: true, status: EStatusState.Idle })),
);

export const GLOBAL_FEATURE_KEY = 'Global';
@Injectable()
export class SGlobal {
  select = createFeatureSelector<StateGlobal>(GLOBAL_FEATURE_KEY);
  isLoading;
  status;
  data!: Observable<any | undefined>;
  user!: Observable<IMUser | undefined>;
  language;
  isCollapseMenu;

  constructor(@Inject(Store) readonly store: Store) {
    this.isLoading = this.store.select(createSelector(this.select, state => state.isLoading));
    this.status = this.store.select(createSelector(this.select, state => state.status));
    this.data = this.store.select(createSelector(this.select, state => state.data));
    this.user = this.store.select(createSelector(this.select, state => state.user));
    this.language = this.store.select(createSelector(this.select, state => state.language));
    this.isCollapseMenu = this.store.select(createSelector(this.select, state => state.isCollapseMenu));
  }
  set = (payload: StateGlobal) => this.store.dispatch(set({ payload }));
  setLanguage = (payload: string) => this.store.dispatch(setLanguage({ payload }));
  postLogin = (data: { password: string; email: string }) => this.store.dispatch(postLogin({ payload: { data } }));
  getAll = () => this.store.dispatch(getAll());
}
