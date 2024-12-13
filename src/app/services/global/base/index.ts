import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction, props } from '@ngrx/store';
import { switchMap } from 'rxjs';

import type { IMUser } from '@/interfaces/model';
import { API, C_API, KEY_REFRESH_TOKEN, KEY_TOKEN, KEY_USER } from '@/utils';

export const fulfilled = createAction('[GLOBAL] Fulfilled', props<{ payload: any }>());
export const rejected = createAction('[GLOBAL] Rejected', props<{ payload: any }>());

export const postLogin = createAction('[GLOBAL] Post Login', props<{ payload: any }>());

@Injectable()
export class GlobalEffects {
  readonly actions$ = inject(Actions);

  postLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postLogin),
      switchMap(async ({ payload }) => {
        try {
          const { data } = await API.post<{ user: IMUser; access_token: string; refreshToken: string }>({
            url: `${C_API.Auth}/login`,
            values: payload.data,
          });
          if (data) {
            localStorage.setItem(KEY_TOKEN, data?.access_token);
            localStorage.setItem(KEY_REFRESH_TOKEN, data?.refreshToken);
            localStorage.setItem(KEY_USER, JSON.stringify(data?.user));
          }
          return fulfilled({ payload: { user: data?.user ?? {}, data: undefined } });
        } catch (e) {
          return rejected({ payload: {} });
        }
      }),
    ),
  );
}
