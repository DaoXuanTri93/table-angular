import { fulfilled } from '@/services/global/base';
import { API, C_API } from '@/utils';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction } from '@ngrx/store';
import { switchMap } from 'rxjs';

export const getAll = createAction('[Project] Get All');

@Injectable()
export class ProductEffect {
  readonly actions$ = inject(Actions);
  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAll),
      switchMap(async params => {
        const data = await API.get<{ data: any }>({
          url: `${C_API.Code}`,
          params,
        });
        console.log('data', data);
        return fulfilled({ payload: { data: data } });
      }),
    ),
  );
}
