// import { EStatusState } from '@/enums';
// import { Inject, Injectable } from '@angular/core';
// import { createFeatureSelector, createReducer, on, Store } from '@ngrx/store';
// import { initialState, type StateGlobal } from '../global/state';
// import { getAll } from './base';

// export const projectReducer = createReducer(
//   initialState,
//   on(getAll, state => ({ ...state, isLoading: true, status: EStatusState.Idle })),
// );
// export const PROJECT_FEATURE_KEY = 'projectGlobal';
// @Injectable()
// export class ProjectGloble {
//   select = createFeatureSelector<StateGlobal>(PROJECT_FEATURE_KEY);
//   constructor(@Inject(Store) readonly store: Store) {}
//   getAll = () => {
//     console.log('vao day');
//     return this.store.dispatch(getAll());
//   };
// }
