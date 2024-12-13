import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Inject,
  Input,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import type { Column } from '@tanstack/angular-table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { EIcon, ETableFilterType } from '@/enums';
import { TFunction } from '@/utils/angular';
import { CSvgIcon } from '../svg-icon';
import { ETypeFilter } from './util';

@Component({
  selector: '[Filter]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CommonModule, NzDropDownModule, CSvgIcon],
  template: `{{ handleAddClass(columnFilterValue) }}
    <svg
      nz-dropdown
      nzTrigger="click"
      [nzDropdownMenu]="dropdown"
      CSvgIcon
      [name]="columnFilterValue === undefined ? EIcon.Filter : EIcon.FilterFill"
      [size]="10"
    ></svg>
    <nz-dropdown-menu #dropdown="nzDropdownMenu"> sss </nz-dropdown-menu>`,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class Filter implements OnInit {
  EIcon = EIcon;
  @Input() column: Column<any>;
  @Input() refFilterTypeCurrent?: any;
  constructor(
    @Inject(ElementRef) private readonly el: ElementRef<SVGElement>,
    @Inject(TranslateService) public t: TFunction,
  ) {}

  typeFilter = computed(() => ({
    text: [
      { value: ETypeFilter.IncludeText, label: this.t.instant('IncludeInputBelow') },
      { value: ETypeFilter.NotIncludeText, label: this.t.instant('DoNotIncludeInputBelow') },
      { value: ETypeFilter.StartText, label: this.t.instant('StartWithInputBelow') },
      { value: ETypeFilter.EndText, label: this.t.instant('EndWithInputBelow') },
      { value: ETypeFilter.SameText, label: this.t.instant('SameWithInputBelow') },
    ],
    date: [
      { value: ETypeFilter.SameDate, label: this.t.instant('DateMakeSame') },
      { value: ETypeFilter.BeforeDate, label: this.t.instant('DayBeforeInputBelow') },
      { value: ETypeFilter.AfterDate, label: this.t.instant('DayAfterInputBelow') },
    ],
    number: [
      { value: ETypeFilter.GreaterNumber, label: this.t.instant('GreaterThanInputBelow') },
      { value: ETypeFilter.GreaterEqualNumber, label: this.t.instant('GreaterThanOrEqualTo') },
      { value: ETypeFilter.LessNumber, label: this.t.instant('SmallerThanInputBelow') },
      { value: ETypeFilter.LessEqualNumber, label: this.t.instant('SmallerThanOrEqualTo') },
      { value: ETypeFilter.EqualNumber, label: this.t.instant('EqualToBelow') },
      { value: ETypeFilter.NotEqualNumber, label: this.t.instant('NotEqualToBelow') },
      { value: ETypeFilter.MiddleNumber, label: this.t.instant('InTheMiddleOfInputBelow') },
      { value: ETypeFilter.NotMiddleNumber, label: this.t.instant('NotInTheMiddleOfInputBelow') },
    ],
  }));

  state = {
    value: '',
    isOpen: false,
    error: false,
  };

  columnFilterValue: unknown;
  refValue: unknown;
  refValueEnd: unknown;
  refValueDate: unknown;
  ngOnInit(): void {
    this.el.nativeElement.setAttribute('type', 'button');
    // if (this.size) {
    //   this.el.nativeElement.style.width = `${this.size}px`;
    //   this.el.nativeElement.style.height = `${this.size}px`;
    // }
    this.state.value = this.refFilterTypeCurrent[this.column.id];
    this.columnFilterValue = this.column.getFilterValue();
    this.refValue =
      typeof this.columnFilterValue !== 'object'
        ? (this.columnFilterValue?.toString() ?? '')
        : ((this.columnFilterValue as [number, number])?.[0]?.toString() ?? '');
    this.refValueEnd =
      typeof this.columnFilterValue !== 'object' ? (this.columnFilterValue as [number, number])?.[1]?.toString() : '';
    this.refValueDate = this.columnFilterValue;
  }

  listClass = ['filter'];
  handleAddClass = columnFilterValue => {
    this.el.nativeElement.setAttribute(
      'class',
      [...this.listClass, columnFilterValue === undefined ? 'opacity-0' : ''].join(' '),
    );
  };

  handleReset = () => {
    delete this.refFilterTypeCurrent[this.column.id];
    this.column.columnDef.filterFn = undefined;
    this.column.setFilterValue(undefined);
    this.state.error = false;
    this.state.isOpen = false;
    this.state.value = this.refFilterTypeCurrent.value[this.column.id];
  };

  handleSubmit = () => {
    let value = this.refValue ?? null;
    let isOpen = true;
    if (this.state.value) {
      this.refFilterTypeCurrent[this.column.id] = this.state.value;
      if (this.state.value === ETypeFilter.MiddleNumber || this.state.value === ETypeFilter.NotMiddleNumber) {
        value = this.refValue && this.refValueEnd ? [this.refValue, this.refValueEnd] : null;
      } else if (this.column.columnDef.meta?.filter === ETableFilterType.Date) value = this.refValueDate ?? null;
      if (this.state.value === ETypeFilter.Blank || this.state.value === ETypeFilter.NotBlank) {
        this.column.columnDef.filterFn = this.state.value;
        this.column.setFilterValue(null);
        isOpen = false;
      } else if (value) {
        this.column.columnDef.filterFn = this.state.value as any;
        this.column.setFilterValue(value);
        isOpen = false;
      }
    }
    this.state.error = isOpen;
    this.state.isOpen = isOpen;
    this.state.value = this.refFilterTypeCurrent.value[this.column.id];
  };

  // set value when input field change.
  handleOnChangeValue = e => {
    if ((e.target.value && this.state.error) || (!e.target.value && !this.state.error)) {
      this.state.error = !this.state.error;
    }
    this.refValue = e.target.value;
  };

  // set value when range number field change.
  handleOnChangeValueEnd = e => {
    this.refValueEnd = e.target.value;
    if ((e.target.value && this.state.error) || (!e.target.value && !this.state.error)) {
      this.state.error = !this.state.error;
    }
  };

  // set value when date pick field change.
  handleOnChangeValueDate = e => {
    this.refValueDate = e;
    if ((e && this.state.error) || (!e && !this.state.error)) {
      this.state.error = !this.state.error;
    }
  };
}
