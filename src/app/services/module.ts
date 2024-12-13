import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GLOBAL_FEATURE_KEY, globalReducer } from './global';
import { GlobalEffects } from './global/base';
import { ProductEffect } from './product/base';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ [GLOBAL_FEATURE_KEY]: globalReducer }),
    EffectsModule.forRoot([GlobalEffects, ProductEffect]),
  ],
})
export class GlobalStateModule {}
