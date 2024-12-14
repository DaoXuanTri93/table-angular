import { EStatusState } from '@/enums';
import { Injectable } from '@angular/core';
import { createAction, createFeatureSelector, createReducer, createSelector, on, props, type Store } from '@ngrx/store';
import type { Observable } from 'rxjs';
import { initialProjectState, type ProjectState } from './state';

//b1: tạo action getAllProject
//b2: tạo state initial state
//b3: tạo Reducer cho Project
//b4: tạo Selectors cho Project
//b5: tích hợp vào Store
//b6 :tạo Service để Dispatch và Select

//b1
export const getAllProject = createAction('[PROJECT] Get All Project');
export const getAllProjectSuccess = createAction('[PROJECT] Get All Projects Success', props<{ payload: any[] }>());
export const getAllProjectsFailure = createAction('[PROJECT] Get All Projects Failure', props<{ errors: any[] }>());

//b3
export const ProjectREducer = createReducer(
  //b2
  initialProjectState,
  on(getAllProject, state => ({ ...state, isLoading: true, status: EStatusState.Idle, errors: null })),
  on(getAllProjectSuccess, state => ({ ...state, isLoading: true, status: EStatusState.IsFulfilled, errors: null })),
  on(getAllProjectsFailure, state => ({ ...state, isLoading: false, status: EStatusState.Idle, errors: null })),
);

//b4
export const selectProjectState = createFeatureSelector<ProjectState>('Project');
export const selectProjects = createSelector(selectProjectState, state => state.projects);
export const selectProjectsLoading = createSelector(selectProjectState, state => state.isLoading);

export const selectProjectsError = createSelector(selectProjectState, state => state.errors);

//b5 import StoreModule  StoreModule.forFeature('Project', projectReducer)

//b6
@Injectable({ providedIn: 'root' })
export class ProjectService {
  projects$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  errors$: Observable<any | null>;
  status$: Observable<EStatusState>;
  constructor(private store: Store) {
    this.projects$ = this.store.select(selectProjects);
    this.isLoading$ = this.store.select(selectProjectsLoading);
    this.errors$ = this.store.select(selectProjectsError);
  }
}
