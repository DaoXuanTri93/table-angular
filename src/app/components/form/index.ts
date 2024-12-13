import { CommonModule } from '@angular/common';
import type { OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { type FormApi, injectForm, injectStore } from '@tanstack/angular-form';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import type { IForm } from '@/interfaces';
import { TFunction } from '@/utils/angular';
import { convertFormValue } from './convert';
import { Field } from './field';

@Component({
  selector: '[CForm]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CommonModule, NzSpinModule, Field],
  template: `
    <nz-spin [nzSpinning]="isLoading">
      <input type="submit" hidden *ngIf="isEnterSubmit" />
      <ng-template ngFor let-item [ngForOf]="columns" let-index="index">
        <div Field [item]="item" [index]="index" [name]="item.name" [t]="t" [form]="form" [values]="values"></div>
      </ng-template>
    </nz-spin>
    <ng-container [ngTemplateOutlet]="footer" [ngTemplateOutletContext]="{ canSubmit, form }"></ng-container>
  `,
  styleUrl: './index.less',
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class CForm implements OnInit, OnChanges {
  @Input() values: any = {};

  @Input() className: string = '';
  @Input() columns: IForm[];
  @Input() isLoading: boolean;
  @Input() isEnterSubmit: boolean;
  @Input() footer: TemplateRef<any>;

  @Output() onSubmit = new EventEmitter<{ value: any; formApi: FormApi<any, any> }>();

  constructor(
    @Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>,
    @Inject(TranslateService) public t: TFunction,
  ) {
    this.t.prefix = 'Components';
  }

  ngOnInit(): void {
    const listClass = ['c-form', this.className];
    this.el.nativeElement.setAttribute('class', listClass.join(' '));
    this.el.nativeElement.onsubmit = e => {
      e.preventDefault();
      e.stopPropagation();
      this.form.handleSubmit();
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['columns'] && changes['columns'].currentValue !== changes['columns'].previousValue) ||
      (changes['values'] && changes['values'].currentValue !== changes['values'].previousValue)
    ) {
      this.form.reset();
      if (changes['columns'].currentValue.length)
        this.form.update({
          ...this.form.options,
          defaultValues: convertFormValue(
            changes['columns'].currentValue,
            changes['values']?.currentValue ?? {},
            false,
          ),
        });
    }
  }

  handleSubmit = ({ value }) => {
    this.onSubmit.emit({ value: convertFormValue(this.columns ?? [], value ?? '', true), formApi: this.form });
  };
  form = injectForm({
    onSubmit: this.handleSubmit,
  });

  canSubmit = injectStore(this.form, state => state.canSubmit);
}
