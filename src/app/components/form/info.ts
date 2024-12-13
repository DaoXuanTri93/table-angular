import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, ViewEncapsulation } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { EFormType, EIcon } from '@/enums';
import type { IFormItem } from '@/interfaces';
import { CSvgIcon } from '../svg-icon';
import { CEMask } from './entry/mask';
import { CEPassword } from './entry/password';
import { CESelect } from './entry/select';

@Component({
  selector: '[Info]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NzSpinModule, CSvgIcon, CEMask, CEPassword, CESelect],
  template: `
    <ng-container [ngSwitch]="formItem?.type">
      <!-- CEMask -->
      <div
        *ngSwitchDefault
        CEMask
        [value]="field.api.state.value"
        [mask]="formItem?.text?.mask"
        [addonBefore]="formItem?.text?.addonBefore"
        [addonAfter]="formItem?.text?.addonAfter"
        [placeholder]="t.instant(formItem?.placeholder ?? 'Enter', { title: title.toLowerCase() })"
        (onBlur)="
          formItem?.onBlur?.({ value: $any($event).target.value, form, name: field.name }); field.api.handleBlur()
        "
        (onChange)="formItem?.onChange?.($any($event).target.value); field.api.handleChange($any($event).target.value)"
        [disabled]="formItem?.disabled?.({ value })"
      ></div>

      <!-- CEPassword -->
      <div
        *ngSwitchCase="EFormType.Password"
        CEPassword
        [value]="field.api.state.value"
        [placeholder]="t.instant(formItem?.placeholder ?? 'Enter', { title: title.toLowerCase() })"
        (onBlur)="
          formItem?.onBlur?.({ value: $any($event).target.value, form, name: field.name }); field.api.handleBlur()
        "
        (onChange)="formItem?.onChange?.($any($event).target.value); field.api.handleChange($any($event).target.value)"
        [disabled]="formItem?.disabled?.({ value })"
      ></div>

      <!-- CESelect -->
      <div
        *ngSwitchCase="EFormType.Select"
        CESelect
        [listOfOption]="formItem?.list!"
        [placeHolder]="t.instant(formItem?.placeholder ?? 'Enter', { title: title.toLowerCase() })"
        (onChange)="formItem?.onChange?.($any($event).target.value); field.api.handleChange($any($event))"
      ></div>

      <!-- Hidden -->
      <input *ngSwitchCase="EFormType.Hidden" [value]="value" type="hidden" [name]="field.name" tabIndex="-1" />
    </ng-container>

    <div class="feedback">
      @if (field.api.state.meta.isTouched && field.api.state.meta.errors.length > 0) {
        {{ field.api.state.meta.errors.join(',') }}
      } @else if (field.api.state.meta.isValidating) {
        {{ t.instant('Validating') }} <nz-spin nzSimple nzSize="small" />
      }
      {{ isError(field) ? '' : '|' }}
    </div>
    <svg *ngIf="isError(field)" CSvgIcon [name]="EIcon.Warning" className="svg-error"></svg>
  `,
})
export class Info implements OnInit {
  EIcon = EIcon;
  EFormType = EFormType;

  @Input() form: any;
  @Input() t: any;

  @Input() field: any;
  @Input() formItem?: IFormItem;
  @Input() meta: any;
  @Input() title: string;
  @Input() value: any;

  constructor(@Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>) {}

  ngOnInit(): void {
    const listClass = [''];
    this.el.nativeElement.setAttribute('class', listClass.join(' '));
  }

  isError = (field: any) =>
    (field.api.state.meta.isTouched && field.api.state.meta.errors.length > 0) || field.api.state.meta.isValidating;
}
