import { Component, computed, Inject, type OnDestroy, type OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';

import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { EButtonSize, EFormRuleType, EFormType, EStatusState } from '@/enums';
import { SGlobal } from '@/services/global';
import { LINK } from '@/utils';
import { TFunction } from '@/utils/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-base-login',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, TranslateModule, CButton, CForm],
  template: `
    <div class="intro-x">
      <h1>{{ t.instant('SignIn') }}</h1>
      <h5>{{ t.instant('EnterYourDetailsToLoginToYourAccount') }}</h5>
      <form
        CForm
        [columns]="columns()"
        [footer]="footer"
        [isEnterSubmit]="true"
        (onSubmit)="handleSubmit($event)"
        [isLoading]="(sGlobal.isLoading | async) ?? false"
      >
        <ng-template #footer let-canSubmit="canSubmit" let-form="form">
          <div class="-mt-2 text-right">
            <button class="text-base-content/60" type="button" [title]="t.instant('LinkForgotPassword')">
              {{ t.instant('LinkForgotPassword') }}
            </button>
            <button
              CButton
              [size]="EButtonSize.Large"
              [text]="t.instant('LogIn')"
              (click)="form.handleSubmit()"
              [disabled]="!canSubmit()"
            ></button>
          </div>
        </ng-template>
      </form>
    </div>
  `,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class PageLogin implements OnInit, OnDestroy {
  EButtonSize = EButtonSize;
  constructor(
    @Inject(TranslateService) readonly t: TFunction,
    @Inject(SGlobal) readonly sGlobal: SGlobal,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Pages.Base.Login';
  }

  readonly destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  ngOnInit(): void {
    this.sGlobal.status.pipe(takeUntil(this.destroyed$)).subscribe(status => {
      this.sGlobal.user.pipe(takeUntil(this.destroyed$), take(1)).subscribe(user => {
        if (status === EStatusState.IsFulfilled && user && Object.keys(user).length > 0) {
          this.sGlobal.language.pipe(takeUntil(this.destroyed$), take(1)).subscribe(language => {
            this.sGlobal.set({ status: EStatusState.Idle });
            this.router.navigate([`/${language}${LINK.Dashboard}`], { replaceUrl: true });
          });
        }
      });
    });
  }
  columns = computed(() => [
    {
      name: 'username',
      title: 'Username',
      formItem: {
        rules: [{ type: EFormRuleType.Required }],
        // rules: [{ type: EFormRuleType.Required }, { type: EFormRuleType.Email }],
      },
    },
    {
      name: 'password',
      title: 'Password',
      formItem: {
        type: EFormType.Password,
        notDefaultValid: true,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
  ]);
  handleSubmit = ({ value }) => {
    this.sGlobal.postLogin(value);
  };
}
