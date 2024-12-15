import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, props } from '@ngrx/store';
import { switchMap } from 'rxjs';

import { API, C_API } from '@/utils';

export const fulfilled = createAction('[PROJECT] Fulfilled', props<{ payload: any }>());
export const rejected = createAction('[PROJECT] Rejected', props<{ payload: any }>());

export const fetchProjects = createAction('[PROJECT] Fetch Projects', props<{ payload: any }>());

@Injectable()
export class ProjectEffects {
  readonly actions$ = inject(Actions);

  fetchProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchProjects),
      switchMap(async () => {
        try {
          const data = (await API.get<any>({
            url: `${C_API.Project}`,
          })) as any[];
          const listOfData = data.map(element => {
            return {
              edit: `${element.userId}`,
              project: `${element.title}`,
              workContent: `Content ${element.body}`,
              mainHours: Math.floor(Math.random() * 100),
              value: Math.random().toFixed(2),
              action1: `Action ${element.userId}-1`,
              action2: `Action ${element.userId}-2`,
            };
          });

          return fulfilled({ payload: { data: listOfData } });
        } catch (e) {
          return rejected({ payload: {} });
        }
      }),
    ),
  );
}
