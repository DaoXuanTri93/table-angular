import { EIcon } from '@/enums';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '[CESelect]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, NzSelectModule],
  template: `
    <nz-select
      [nzMaxTagCount]="3"
      [nzMaxTagPlaceholder]="tagPlaceHolder"
      nzMode="multiple"
      [nzPlaceHolder]="placeHolder"
      nzAllowClear
      [(ngModel)]="value"
      (ngModelChange)="onChange.emit($event)"
    >
      @for (item of listOfOption; track item) {
        <nz-option [nzLabel]="item.label" [nzValue]="item.value"></nz-option>
      }
    </nz-select>
    <ng-template #tagPlaceHolder let-selectedList>and {{ selectedList.length }} more selected</ng-template>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `,
  ],
})
export class CESelect {
  EIcon = EIcon;
  @Input() placeHolder: any;
  @Input() listOfOption: any[] = [];
  @Input() value: any[] = [];
  @Output() onChange = new EventEmitter<Event>();
}
