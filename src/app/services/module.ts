import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GLOBAL_FEATURE_KEY, globalReducer } from './global';
import { GlobalEffects } from './global/base';
import { PROJECT_FEATURE_KEY, projectReducer } from './projects';
import { ProjectEffects } from './projects/base';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({ [GLOBAL_FEATURE_KEY]: globalReducer, [PROJECT_FEATURE_KEY]: projectReducer }),
    EffectsModule.forRoot([GlobalEffects, ProjectEffects]),
  ],
})
export class GlobalStateModule {}
